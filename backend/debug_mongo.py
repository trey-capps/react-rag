
def main():
    from pymongo import MongoClient
    import os
    from pymongo.mongo_client import MongoClient
    from bson import ObjectId
    from dotenv import load_dotenv

    load_dotenv('secrets.env')

    uri = f"mongodb+srv://treycapps:{os.getenv('MONGO_CONN_PASS')}@cluster0.ca61l.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    client = MongoClient(uri)

    db = client['chatbot_db']
    users_collection = db['users']

    # Insert a test user
    users_collection.insert_one({'email': 'test@example.com', 'password': 'hashed_password'})

    # Check if the user is in the collection
    user = users_collection.find_one({'email': 'test@example.com'})
    print(user)


if __name__ == '__main__':
    main()