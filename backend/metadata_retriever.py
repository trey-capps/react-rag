from llama_index.core import StorageContext
from llama_index.vector_stores.chroma import ChromaVectorStore
from llama_index.embeddings.huggingface import HuggingFaceEmbedding
from llama_index.core.indices.vector_store.base import VectorStoreIndex

def create_collection_retriever(collection): #chroma.collection

    vector_store = ChromaVectorStore(chroma_collection = collection)
    storage_context = StorageContext.from_defaults(vector_store = vector_store)
    embed_model = HuggingFaceEmbedding(model_name = "all-MiniLM-L6-v2")

    index = VectorStoreIndex.from_vector_store(
        vector_store = vector_store,
        storage_context = storage_context,
        embed_model = embed_model,
        similarity_top_k = 3
    )
    retriever = index.as_retriever()

    return retriever