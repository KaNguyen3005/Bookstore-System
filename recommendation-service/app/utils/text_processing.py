from pyvi import ViTokenizer
from sklearn.feature_extraction.text import TfidfVectorizer

def my_vietnamese_tokenizer(text):
    #PyVi dùng để nối từ cho tiết việt: kinh tế học -> kinh_tế_học
    text = text.lower().strip()
    tokens = ViTokenizer.tokenize(text)
    return tokens.split()

