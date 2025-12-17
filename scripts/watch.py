import time
import json
import sys
import os

FILE_PATH = r'C:\projects1\GeminiStravaClient\FTPTrainer\public\conversation.json'

def get_last_message():
    try:
        if not os.path.exists(FILE_PATH):
            return None
        
        # Dosya okuma çakışmalarını önlemek için basit retry
        for _ in range(3):
            try:
                with open(FILE_PATH, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    if data.get('messages'):
                        return data['messages'][-1]
                break
            except:
                time.sleep(0.1)
        return None
    except Exception as e:
        return None

print("👀 Web arayüzü dinleniyor... (Mesaj yazın)")

# Başlangıçtaki son mesajı al (kendi mesajımızı tekrar okumayalım diye)
last_known_msg = get_last_message()
last_id = last_known_msg['id'] if last_known_msg else 0

# Eğer zaten cevaplanmamış bir kullanıcı mesajı varsa hemen al
if last_known_msg and last_known_msg['role'] == 'user':
    print(f"PENDING_MESSAGE: {last_known_msg['content']}")
    sys.exit(0)

# Döngüye gir
timeout = 300 # 5 dakika bekle
start_time = time.time()

while (time.time() - start_time) < timeout:
    current_msg = get_last_message()
    
    if current_msg and current_msg['id'] > last_id:
        if current_msg['role'] == 'user':
            print(f"NEW_MESSAGE: {current_msg['content']}")
            sys.exit(0)
        else:
            # Asistan mesajıysa ID'yi güncelle, beklemeye devam et
            last_id = current_msg['id']
    
    time.sleep(1)

print("TIMEOUT")
sys.exit(0)
