import sys
import os
import pandas as pd
import threading
import time
import requests
import signal

# Append the root path to sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from config.settings import CSV_PATH, ENDPOINT_BASE, SEND_DELAY, MAX_MACHINES

running = True  # Global flag to handle shutdown gracefully

def signal_handler(sig, frame):
    global running
    print("\n🛑 Shutting down simulator gracefully...")
    running = False
    sys.exit(0)

# Register SIGINT handler (Ctrl+C)
signal.signal(signal.SIGINT, signal_handler)

def stream_machine_data(machine_id, machine_data):
    print(f"🚀 [Machine {machine_id}] Starting stream...")
    for index, row in machine_data.iterrows():
        if not running:
            break

        payload = {
            "machineId": machine_id,
            "timestamp": time.time(),
            "airTemperature": row["Air temperature [K]"],
            "processTemperature": row["Process temperature [K]"],
            "rotationalSpeed": row["Rotational speed [rpm]"],
            "torque": row["Torque [Nm]"],
            "toolWear": row["Tool wear [min]"],
            "productQuality": row["Product ID"][0],  # L, M, or H
            "machineFailure": row["Machine failure"],
        }

        try:
            # ✅ FIXED: Use ENDPOINT_BASE directly, don't append machine_id to URL
            response = requests.post(ENDPOINT_BASE, json=payload)
            print(f"📤 [Machine {machine_id}] Sent data: {payload}")
            print(f"✅ [{machine_id}] Response Status: {response.status_code}")
        except Exception as e:
            print(f"❌ [{machine_id}] Error sending data: {e}")

        time.sleep(SEND_DELAY)

    print(f"✅ [Machine {machine_id}] Finished sending all data.")

def run():
    print(f"🎯 Starting data simulation with {MAX_MACHINES} machines...")
    print(f"📊 Loading data from: {CSV_PATH}")
    print(f"🌐 Sending to endpoint: {ENDPOINT_BASE}")
    print(f"⏱️  Delay between sends: {SEND_DELAY} seconds")
    print("=" * 50)
    
    df = pd.read_csv(CSV_PATH)
    split_data = [df.iloc[i::MAX_MACHINES] for i in range(MAX_MACHINES)]

    threads = []
    for i in range(MAX_MACHINES):
        machine_id = f"M{i+1}"
        t = threading.Thread(target=stream_machine_data, args=(machine_id, split_data[i]))
        t.start()
        threads.append(t)

    for t in threads:
        t.join()

    print("🎉 All machines finished streaming.")