import pandas as pd
import time
import json
import random
from config.settings import CSV_FILE_PATH, DELAY_SECONDS, MACHINE_IDS

# Load dataset
df = pd.read_csv(CSV_FILE_PATH)
df.columns = [col.strip().replace(' ', '_').lower() for col in df.columns]

def stream_data(send_callback):
    """Streams random rows as machine telemetry."""
    while True:
        row = df.sample(1).to_dict(orient="records")[0]
        machine_id = random.choice(MACHINE_IDS)

        payload = {
            "machine_id": machine_id,
            "air_temp": row["air_temperature_[k]"],
            "process_temp": row["process_temperature_[k]"],
            "torque": row["torque_[nm]"],
            "rotational_speed": row["rotational_speed_[rpm]"],
            "tool_wear": row["tool_wear_[min]"],
            "product_quality": row["product_id"][0],
            "machine_failure": bool(row["machine_failure"]),
            "failure_types": {
                "TWF": bool(row["twf"]),
                "HDF": bool(row["hdf"]),
                "PWF": bool(row["pwf"]),
                "OSF": bool(row["osf"]),
                "RNF": bool(row["rnf"]),
            }
        }

        send_callback(payload)
        time.sleep(DELAY_SECONDS)
