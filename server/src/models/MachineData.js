import mongoose from "mongoose";

const MachineDataSchema = new mongoose.Schema({
  machineId: String,
  timestamp: { type: Date, default: Date.now },
  airTemperature: Number,      
  processTemperature: Number,  
  rotationalSpeed: Number,     
  torque: Number,
  toolWear: Number,
  productQuality: String,
  machineFailure: Boolean,
});

const MachineData = mongoose.model("MachineData", MachineDataSchema);

export default MachineData;