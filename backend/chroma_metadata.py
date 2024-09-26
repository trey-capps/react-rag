import chromadb
from typing import Dict, List, Optional

class ClientFactory:
    def __init__(self):
        self.factory = {}

    def does_collection_exist(self, name):
        return name in self.factory

    def register(self, name, client):
        if not self.does_collection_exist(name):
            self.factory[name] = client
        else:
            raise Exception(f"{name} already registered in factory")

    def unregister(self, name):
        if self.does_collection_exist(name):
            del self.factory[name]
        else:
            raise Exception(f"{name} not registered in factory")

    def get_collection(self, name):
        if not self.does_collection_exist(name):
            raise Exception(f"{name} not registered in factory")
        return self.factory[name]

class MetadataCollection(ClientFactory):
    def __init__(self):
        super().__init__()
        self.chroma_path = "testing"
        self.client = self.get_or_create_client()
        self.embedding_function = self.get_embedding_function()

    def get_or_create_client(self, **kwargs):
        import chromadb
        from chromadb.config import Settings

        return chromadb.Client(Settings(anonymized_telemetry=False, **kwargs))

    def get_embedding_function(self, **kwargs):
        from chromadb.utils import embedding_functions

        return embedding_functions.SentenceTransformerEmbeddingFunction(model_name="all-MiniLM-L6-v2")

    def add_metadata(self, collection_name: str, content: List[str], metadata: Optional[List[Dict[str, str]]] = None, id: Optional[List[str]] = None):
        import uuid

        collection = self.get_or_create_collection(collection_name)
        collection.add(
            documents = content,
            metadatas = metadata,
            ids = [str(uuid.uuid4()) for _ in content]
        )
        return collection

    @staticmethod
    def _chroma_collection_metadata():
        return {"hnsw:space": "cosine"}

    def _does_collection_exists(self, collection_name: str):
        return collection_name in [collection.name for collection in self.client.list_collections()]

    def _get_collection(self, collection_name: str):
        return self.client.get_collection(name = collection_name, embedding_function = self.embedding_function)

    def _create_collection(self, collection_name: str):
        return self.client.create_collection(name = collection_name, embedding_function = self.embedding_function, metadata = self._chroma_collection_metadata())

    def get_or_create_collection(self, collection_name: str):
        if not self._does_collection_exists(collection_name):
            return self._create_collection(collection_name)
        return self._get_collection(collection_name)

    def register_collection(self, collection_name: str, collection):
        self.register(collection_name, collection)