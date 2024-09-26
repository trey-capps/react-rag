from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

app = Flask(__name__)
CORS(app)

load_dotenv('secrets.env')

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

@app.route('/api/answer', methods=['POST'])
def get_answer():
    data = request.get_json()
    question = data.get('question')
    # Your logic for processing the question and getting an answer

    return jsonify({'response': f'Bot answer to {question}'})
    # inter_ans = classify_intent(question)
    # final_answer = f"Answer to the question: {question}"
    # return jsonify({
    #     'intermediate_results': inter_ans,
    #     'answer': final_answer
    # })

if __name__ == '__main__':
    #res = classify_intent("What is the principal place for Silver Creset Vineyards")
    #print(res)
    app.run(host='0.0.0.0', port=5000)