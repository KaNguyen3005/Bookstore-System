from pathlib import Path


def get_stop_words():

    file_path = Path(__file__).parent / 'stop_words.txt'

    with open(file_path, 'r', encoding='utf-8') as f:
        stop_words = [
            line.strip().replace(' ', '_')
            for line in f.readlines()
            if line.strip()
        ]
        return stop_words
    
if __name__ == '__main__':
    print(get_stop_words())