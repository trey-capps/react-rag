from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

# Sample Corpus
sample_document_json = [
    {
        "subheading": "Section 2. Principal Place of Business",
        "content": "The principal office and place of business of the Partnership (the \"Office\") shall be located at Angell Road.",
        "company_name": "Term Sheet 80 - Silver Crest Vineyards"
    },
    {
        "subheading": "Section 3. Business and Purpose",
        "content": "3.1. The business and purposes of the Partnership are to manage, and operate, grape vineyards. (the \"Vineyards\"), or interest therein, including but not limited to that certain parcel of land and such other businesses and purposes as the Partners may from time to time determine in accordance with Section 8 of this Agreement.",
        "company_name": "Term Sheet 80 - Silver Crest Vineyards"
    },
    {
        "subheading": "Section 4. Term",
        "content": "The Partnership shall commence upon the date of this Agreement, as set forth above. Unless sooner terminated pursuant to the further provisions of this Agreement, the Partnership shall continue without defined term.",
        "company_name": "Term Sheet 80 - Silver Crest Vineyards"
    },
    {
        "subheading": "Section 11. Banking",
        "content": "All revenue of the Partnership shall be deposited regularly in the Partners private savings and checking accounts at such bank or banks as shall be selected by the Partners. The partners will not borrow any money by or on behalf of, the Partnership.",
        "company_name": "Term Sheet 80 - Silver Crest Vineyards"
    }
]

from openai import OpenAI
from langchain.output_parsers import PydanticOutputParser

from structured_output import IntentWithEntities
from chroma_metadata import MetadataCollection
from metadata_retriever import create_collection_retriever

def openai_intent(user_query: str):
    intent_parser = PydanticOutputParser(pydantic_object=IntentWithEntities)

    intent_system_prompt = """
    You are an intent classifier. Given a query, classify the intent related to Subsection, Generic or Other.
    If there is any mention of a specific fact this will be related to Subsection.
    If there is a questions that would be about an entire document or multiple documents this would be considered Generic.

    In addition any relevant topic and names present in the query should be extracted. Never elaborate.

    A few examples are given below:

    Query: What is the interest for Farrington Farms?
    Response: {"intent": "Subsection", "entity": {"topic": "interest", "name": "Farrington Farms"}}

    Query: provide a summary of the Galliger towing aggreement?
    Response: {"intent": "Generic", "entity": {"name": "Galliger towing"}}
    """

    intent_user_prompt = f"""
    Provide your evalaution in the following format:
    {intent_parser.get_format_instructions()}

    Query: {user_query}
    """
    client = OpenAI()

    raw_response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "system",
                "content": intent_system_prompt
            },
            {
                "role": "user",
                "content": intent_user_prompt
            }
        ]
    )

    response = raw_response.choices[0].message.content

    # Parse the output into the structured format
    parsed_output = intent_parser.parse(response)
    return parsed_output.dict()

def normalize_openai_intent(oai_intent):
    metadata_retrieve = MetadataCollection()

    sample_metadata = [chunk['subheading'] for chunk in sample_document_json]
    print(sample_metadata)

    subheading_collection = metadata_retrieve.add_metadata(
        collection_name = "subheading",
        content = sample_metadata
    )
    metadata_retrieve.register_collection("subheading", subheading_collection)

    subheading_collection = metadata_retrieve.get_collection("subheading")

    retriever = create_collection_retriever(collection=subheading_collection)

    r_s = retriever.retrieve("principal place")
    return [{"score": node.score, "text": node.text} for node in r_s]
    # print([{"score": node.score, "text": node.text} for node in r_s])

def classify_intent(user_query: str):
    oai_intent = openai_intent(user_query)

    if oai_intent['intent'] == 'Subsection':
        metadata_intent = normalize_openai_intent(oai_intent['entity']['topic'])

    else:
        metadata_intent = [{'score': 1, 'text': 'Generic Query'}, {'score': 1, 'text': oai_intent}]

    return metadata_intent



## User Authentication
import os
from flask import Flask, request, jsonify
from pymongo.mongo_client import MongoClient
from bson import ObjectId
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity

load_dotenv('secrets.env')

app = Flask(__name__)
CORS(app)
app.config['JWT_SECRET_KEY'] = 'your_secret_key'  # Replace with a secure key in production
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

uri = f"mongodb+srv://treycapps:{os.getenv('MONGO_CONN_PASS')}@cluster0.ca61l.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
client = MongoClient(uri)

db = client['chatbot_db']
users_collection = db['users']
interactions_collection = db['interactions']

### User-related Endpoints (For future login)

@app.route('/api/register', methods=['POST'])
def register_user():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    if users_collection.find_one({'email': email}):
        return jsonify({'error': 'User already exists'}), 400

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    users_collection.insert_one({'email': email, 'password': hashed_password})
    return jsonify({'message': 'User registered successfully'}), 201

@app.route('/api/login', methods=['POST'])
def login_user():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    user = users_collection.find_one({'email': email})
    if user and bcrypt.check_password_hash(user['password'], password):
        access_token = create_access_token(identity=str(user['_id']))
        return jsonify({'access_token': access_token}), 200
    return jsonify({'error': 'Invalid credentials'}), 401

### Interaction-related Endpoints

@app.route('/api/interactions/<interaction_id>', methods=['GET'])
@jwt_required()
def load_interaction(interaction_id):
    interaction = interactions_collection.find_one({'_id': ObjectId(interaction_id)})

    if not interaction:
        return jsonify({'error': 'Interaction not found'}), 404

    return jsonify({
        'interactionId': str(interaction['_id']),
        'interaction': interaction['interaction'],
        'timestamp': interaction['timestamp']
    }), 200

@app.route('/api/interactions', methods=['POST'], endpoint='save_interaction')
@jwt_required()
def save_interaction():
    user_id = get_jwt_identity()
    data = request.json

    interaction = {
        'userId': user_id,
        'interaction': data.get('interaction'),
        'timestamp': data.get('timestamp')
    }

    # Insert the interaction into the MongoDB collection
    result = interactions_collection.insert_one(interaction)
    if result.inserted_id:
        return jsonify({'success': True, 'interactionId': str(result.inserted_id)}), 201
    else:
        return jsonify({'error': 'Failed to save interaction'}), 500

# Endpoint to retrieve all interactions for a user
@app.route('/api/interactions', methods=['GET'], endpoint='get_user_interactions')
@jwt_required()
def get_user_interactions():
    user_id = get_jwt_identity()

    # Find interactions associated with the user
    interactions = interactions_collection.find({'userId': user_id})

    serialized_interactions = [
        {
            'interactionId': str(interaction['_id']),
            'interaction': interaction['interaction'],
            'timestamp': interaction['timestamp']
        }
        for interaction in interactions
    ]
    print(serialized_interactions)
    return jsonify({'interactions': serialized_interactions}), 200

@app.route('/api/interactions/<interaction_id>', methods=['DELETE'])
@jwt_required()
def delete_interaction(interaction_id):
    user_id = get_jwt_identity()

    # Only allow deletion if the user is the owner of the interaction
    result = interactions_collection.delete_one({
        '_id': ObjectId(interaction_id),
        'userId': user_id
    })

    if result.deleted_count == 1:
        return jsonify({'success': True}), 200
    else:
        return jsonify({'error': 'Interaction not found or unauthorized'}), 404

@app.route('/api/answer', methods=['POST'])
def get_answer():
    data = request.get_json()
    question = data.get('query')
    chat_history = data.get('chatHistory')
    # Your logic for processing the question and getting an answer

    #return jsonify({'answer': f'Bot answer to {question}', 'intermediate_results': ['Section 2. Place of Buisness']})
    #inter_ans = classify_intent(question)
    # final_answer = f"Answer to the question: {question}"
    # results = {
    #     'intermediate_steps': {
    #         'intent': [f"{intent['text']} {round(intent['score'], 2)}" for intent in inter_ans],
    #         'context': ['doc1', 'doc2', 'doc3']
    #     },
    #     'answer': final_answer
    # }
    # print(results)

    expected_results_format = {
        'response': f'Response to question: {question}', 
        'traces': [ # trace_name and content required
            { 'trace_name': 'trace 1', 'content': {'random': 'random', 'context': ['doc1', 'doc2']} },
            { 'trace_name': 'trace 2', 'content': {'titles': ['doc1', 'doc2'], 'other_titles': ['title', 'title']} },
            { 'trace_name': 'Chat History', 'content': chat_history }
        ]
    }
    print("RESPONE:", expected_results_format)
    return jsonify(expected_results_format)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)