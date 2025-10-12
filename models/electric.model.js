import mongoose from "mongoose";

// ✅ Schema for Power Generation
const powerGenerationSchema = new mongoose.Schema(
  {
    WBSEDCL: { type: Number, required: true },
    SOLAR: { type: Number, required: true },
    DG: { type: Number, required: true },
    WBSEDCL_RH: { type: Number, required: true },
    SOLAR_RH: { type: Number, required: true },
    DG_RH: { type: Number, required: true },
  },
  { _id: false }
);

// ✅ Individual Plant Schemas (strict per plant)
const prepSchema = new mongoose.Schema(
  {
    WBSEDCL: { type: Number, required: true },
    SOLAR: { type: Number, required: true },
    BOILER: { type: Number, required: true },
  },
  { _id: false }
);

const solventSchema = new mongoose.Schema(
  {
    WBSEDCL: { type: Number, required: true },
    SOLAR: { type: Number, required: true },
    BOILER: { type: Number, required: true },
  },
  { _id: false }
);

const refinerySchema = new mongoose.Schema(
  {
    WBSEDCL: { type: Number, required: true },
    SOLAR: { type: Number, required: true },
    COMPRESSOR: { type: Number, required: true },
    BOILER: { type: Number, required: true },
  },
  { _id: false }
);

const newPlantSchema = new mongoose.Schema(
  {
    WBSEDCL: { type: Number, required: true },
    COMPRESSOR: { type: Number, required: true },
  },
  { _id: false }
);

const oldPlantSchema = new mongoose.Schema(
  {
    WBSEDCL: { type: Number, required: true },
    COMPRESSOR: { type: Number, required: true },
  },
  { _id: false }
);

const dryerSchema = new mongoose.Schema(
  {
    WBSEDCL: { type: Number, required: true },
    BOILER: { type: Number, required: true },
  },
  { _id: false }
);

const pulverizerSchema = new mongoose.Schema(
  {
    WBSEDCL: { type: Number, required: true },
  },
  { _id: false }
);

// ✅ PlantsConsumption Schema (combine all)
const plantsConsumptionSchema = new mongoose.Schema(
  {
    Prep: { type: prepSchema, required: true },
    Solvent: { type: solventSchema, required: true },
    Refinery: { type: refinerySchema, required: true },
    NewPlant: { type: newPlantSchema, required: true },
    OldPlant: { type: oldPlantSchema, required: true },
    Dryer: { type: dryerSchema, required: true },
    Pulverizer: { type: pulverizerSchema, required: true },
  },
  { _id: false }
);

const tfBoilerSchema = new mongoose.Schema(
  {
    WBSEDCL: { type: Number, required: true },
    SOLAR: { type: Number, required: true },
    RO: { type: Number, required: true },
    COMPRESSOR: { type: Number, required: true },
  },
  { _id: false }
);

const ton12BoilerSchema = new mongoose.Schema(
  {
    WBSEDCL: { type: Number, required: true },
    SOLAR: { type: Number, required: true },
    RO: { type: Number, required: true },
    COMPRESSOR: { type: Number, required: true },
  },
  { _id: false }
);

const ton18BoilerSchema = new mongoose.Schema(
  {
    WBSEDCL: { type: Number, required: true },
    SOLAR: { type: Number, required: true },
    RO: { type: Number, required: true },
    COMPRESSOR: { type: Number, required: true },
  },
  { _id: false }
);

// ✅ Boiler Consumption
const boilerConsumptionSchema = new mongoose.Schema(
  {
    TF_Boiler: { type: tfBoilerSchema, required: true },
    TON_12_Boiler: { type: ton12BoilerSchema, required: true },
    TON_18_Boiler: { type: ton18BoilerSchema, required: true },
  },
  { _id: false }
);

// ✅ Compressor Consumption
const compressorConsumptionSchema = new mongoose.Schema(
  {
    ELGI: { type: Number, required: true },
    KAISER_1: { type: Number, required: true },
    KAISER_2: { type: Number, required: true },
    ELGI_RH: { type: Number, required: true },
    KAISER_1_RH: { type: Number, required: true },
    KAISER_2_RH: { type: Number, required: true },
  },
  { _id: false }
);

// ✅ Main Electric Schema
const electricSchema = new mongoose.Schema(
  {
    date: {
      type: String, // e.g. "2025-08-04"
      required: true,
    },

    PowerGeneration: {
      type: powerGenerationSchema,
      required: true,
    },

    PlantsConsumption: {
      type: plantsConsumptionSchema,
      required: true,
    },

    BoilerConsumption: {
      type: boilerConsumptionSchema,
      required: true,
    },

    CompressorConsumption: {
      type: compressorConsumptionSchema,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const ElectricModel = mongoose.model("Electric", electricSchema);
export default ElectricModel;
