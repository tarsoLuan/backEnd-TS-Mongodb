import random
import json
from nltk_utils import bag_of_words, tokenize
import pickle
import sys


sys.stdout.reconfigure(encoding="utf-8")

with open('assets/files/intents.json', 'r', encoding='utf-8') as f:
    intents = json.load(f)

model = pickle.load(open('assets/model/model.pkl', 'rb'))
loaded_vec = pickle.load(open('assets/model/count_vec.pkl', 'rb'))

bot_name = 'Escola bot'

query = sys.argv[1]

tag = model.predict(loaded_vec.transform([query]))

answer = ''

for intent in intents['intents']:
    if tag == intent['tag']:
        answer = random.choice(intent["responses"]) 
        break
    else:
        answer = "Não entendi, tente novamente!"

print(answer)
sys.stdout.flush()



   

   
    

    

   
        