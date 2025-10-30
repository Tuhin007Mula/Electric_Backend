import ElectricModel from "../models/electric.model.js";

// ✅ Create new electric entry
export const createElectricEntry = async (req, res) => {
  try {
    console.log("📩 [Backend] Received Electric Data:", JSON.stringify(req.body, null, 2));

    const newEntry = new ElectricModel(req.body);
    await newEntry.save();

    res.status(201).json({
      success: true,
      message: "✅ Electric entry created successfully",
      data: newEntry,
    });
  } catch (error) {
    console.error("❌ [createElectricEntry] Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get all electric entries
export const getAllElectricEntries = async (req, res) => {
  try {
    const entries = await ElectricModel.find().sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: entries.length,
      data: entries,
    });
  } catch (error) {
    console.error("❌ [getAllElectricEntries] Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get single electric entry by ID
export const getElectricEntryById = async (req, res) => {
  try {
    const entry = await ElectricModel.findById(req.params.id);

    if (!entry) {
      return res.status(404).json({ success: false, message: "Electric entry not found" });
    }

    res.status(200).json({ success: true, data: entry });
  } catch (error) {
    console.error("❌ [getElectricEntryById] Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Update electric entry
export const updateElectricEntry = async (req, res) => {
  try {
    const updatedEntry = await ElectricModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedEntry) {
      return res.status(404).json({ success: false, message: "Electric entry not found" });
    }

    res.status(200).json({
      success: true,
      message: "✅ Electric entry updated successfully",
      data: updatedEntry,
    });
  } catch (error) {
    console.error("❌ [updateElectricEntry] Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Delete electric entry
export const deleteElectricEntry = async (req, res) => {
  try {
    const deletedEntry = await ElectricModel.findByIdAndDelete(req.params.id);

    if (!deletedEntry) {
      return res.status(404).json({ success: false, message: "Electric entry not found" });
    }

    res.status(200).json({
      success: true,
      message: "🗑️ Electric entry deleted successfully",
    });
  } catch (error) {
    console.error("❌ [deleteElectricEntry] Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// import moment from "moment"; // ✅ install if not already: npm i moment

// export const getElectricDashboard = async (req, res) => {
//   try {
//     let { date } = req.body; // date = "2025-09-14" OR "2025-09-14 2025-09-16"
//     if (!date) {
//       return res.status(400).json({ error: "Date is required" });
//     }

//     // Helper: convert YYYY-MM-DD -> DD-MM-YYYY
//     const formatDate = (d) => {
//       const [y, m, day] = d.split("-");
//       return `${day}-${m}-${y}`;
//     };

//     // Determine start & end dates
//     let startDate, endDate;
//     if (date.includes(" ")) {
//       const [start, end] = date.split(" ");
//       startDate = start;
//       endDate = end;
//     } else {
//       startDate = date;
//       endDate = date;
//     }

//     // Get list of dates between start and end
//     const datesList = [];
//     let current = moment(startDate);
//     const last = moment(endDate);
//     while (current.isSameOrBefore(last)) {
//       datesList.push(current.format("YYYY-MM-DD"));
//       current.add(1, "days");
//     }

//     // Fetch all records in range
//     const records = await ElectricModel.find({
//       date: { $gte: startDate, $lte: endDate },
//     }).lean();

//     // Group records by date
//     const recordsByDate = {};
//     for (const doc of records) {
//       const docDate = doc.date; // YYYY-MM-DD
//       if (!recordsByDate[docDate]) recordsByDate[docDate] = [];
//       recordsByDate[docDate].push(doc);
//     }

//     // Process each date separately
//     const results = [];

//     for (const d of datesList) {
//       const docs = recordsByDate[d] || [];

//       if (!docs.length) {
//         results.push({
//           date: formatDate(d),
//           message: "No data found",
//           powerGeneration: {},
//           totalConsumption: {},
//           WBSEDCLConsumption: {},
//           SOLARConsumption: {},
//           COMPRESSORConsumption: {},
//         });
//         continue;
//       }

//       // --- accumulators ---
//       let powerGeneration = { WBSEDCL: 0, SOLAR: 0, DG: 0, TOTAL: 0 };
//       let totalConsumption = { WBSEDCL: 0, SOLAR: 0, SOLAR_LOSS: 0, TOTAL: 0 };
//       let WBSEDCLConsumption = {
//         PREP: 0,
//         SOLVENT: 0,
//         REFINERY: 0,
//         DRYER: 0,
//         NEW_PLANT: 0,
//         OLD_PLANT: 0,
//         BOILER: 0,
//         PULVERIZER: 0,
//       };
//       let SOLARConsumption = { PREP: 0, SOLVENT: 0, REFINERY: 0, BOILER: 0 };
//       let COMPRESSORConsumption = {
//         ELGI: 0,
//         KAISER1: 0,
//         KAISER2: 0,
//         REFINERY: 0,
//         NEW_PLANT: 0,
//         OLD_PLANT: 0,
//         BOILER: 0,
//       };

//       // --- aggregate per doc ---
//       for (const doc of docs) {
//         const pg = doc.PowerGeneration || {};
//         powerGeneration.WBSEDCL += pg.WBSEDCL || 0;
//         powerGeneration.SOLAR += pg.SOLAR || 0;
//         powerGeneration.DG += pg.DG || 0;
//         powerGeneration.TOTAL +=
//           (pg.WBSEDCL || 0) + (pg.SOLAR || 0) + (pg.DG || 0);

//         const pc = doc.PlantsConsumption || {};
//         WBSEDCLConsumption.PREP += pc.Prep?.WBSEDCL || 0;
//         WBSEDCLConsumption.SOLVENT += pc.Solvent?.WBSEDCL || 0;
//         WBSEDCLConsumption.REFINERY += pc.Refinery?.WBSEDCL || 0;
//         WBSEDCLConsumption.DRYER += pc.Dryer?.WBSEDCL || 0;
//         WBSEDCLConsumption.NEW_PLANT += pc.NewPlant?.WBSEDCL || 0;
//         WBSEDCLConsumption.OLD_PLANT += pc.OldPlant?.WBSEDCL || 0;
//         WBSEDCLConsumption.BOILER +=
//           (doc.BoilerConsumption?.TF_Boiler?.WBSEDCL || 0) +
//           (doc.BoilerConsumption?.TON_12_Boiler?.WBSEDCL || 0) +
//           (doc.BoilerConsumption?.TON_18_Boiler?.WBSEDCL || 0);
//         WBSEDCLConsumption.PULVERIZER += pc.Pulverizer?.WBSEDCL || 0;

//         SOLARConsumption.PREP += pc.Prep?.SOLAR || 0;
//         SOLARConsumption.SOLVENT += pc.Solvent?.SOLAR || 0;
//         SOLARConsumption.REFINERY += pc.Refinery?.SOLAR || 0;
//         SOLARConsumption.BOILER +=
//           (doc.BoilerConsumption?.TF_Boiler?.SOLAR || 0) +
//           (doc.BoilerConsumption?.TON_12_Boiler?.SOLAR || 0) +
//           (doc.BoilerConsumption?.TON_18_Boiler?.SOLAR || 0);

//         const cc = doc.CompressorConsumption || {};
//         COMPRESSORConsumption.ELGI += cc.ELGI || 0;
//         COMPRESSORConsumption.KAISER1 += cc.KAISER_1 || 0;
//         COMPRESSORConsumption.KAISER2 += cc.KAISER_2 || 0;
//         COMPRESSORConsumption.REFINERY += pc.Refinery?.COMPRESSOR || 0;
//         COMPRESSORConsumption.NEW_PLANT += pc.NewPlant?.COMPRESSOR || 0;
//         COMPRESSORConsumption.OLD_PLANT += pc.OldPlant?.COMPRESSOR || 0;
//         COMPRESSORConsumption.BOILER +=
//           (doc.BoilerConsumption?.TF_Boiler?.COMPRESSOR || 0) +
//           (doc.BoilerConsumption?.TON_12_Boiler?.COMPRESSOR || 0) +
//           (doc.BoilerConsumption?.TON_18_Boiler?.COMPRESSOR || 0);
//       }

//       // --- total summary ---
//       totalConsumption.WBSEDCL =
//         WBSEDCLConsumption.PREP +
//         WBSEDCLConsumption.SOLVENT +
//         WBSEDCLConsumption.REFINERY +
//         WBSEDCLConsumption.DRYER +
//         WBSEDCLConsumption.NEW_PLANT +
//         WBSEDCLConsumption.OLD_PLANT +
//         WBSEDCLConsumption.BOILER +
//         WBSEDCLConsumption.PULVERIZER;

//       totalConsumption.SOLAR =
//         SOLARConsumption.PREP +
//         SOLARConsumption.SOLVENT +
//         SOLARConsumption.REFINERY +
//         SOLARConsumption.BOILER;

//       totalConsumption.SOLAR_LOSS =
//         powerGeneration.SOLAR - totalConsumption.SOLAR;

//       totalConsumption.TOTAL =
//         totalConsumption.WBSEDCL +
//         totalConsumption.SOLAR +
//         totalConsumption.SOLAR_LOSS;

//       // --- push result ---
//       results.push({
//         date: formatDate(d), // DD-MM-YYYY
//         powerGeneration,
//         totalConsumption,
//         WBSEDCLConsumption,
//         SOLARConsumption,
//         COMPRESSORConsumption,
//       });
//     }

//     // ✅ Final response
//     res.json({ data: results });

//   } catch (err) {
//     console.error("❌ Error in getElectricDashboard:", err);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };

import moment from "moment";
//import ElectricModel from "../models/electric.model.js";

export const getElectricDashboard = async (req, res) => {
  try {
    let { date } = req.body; // date = "2025-09-14" OR "2025-09-14 2025-09-16"
    if (!date) {
      return res.status(400).json({ error: "Date is required" });
    }

    // Helper: convert YYYY-MM-DD -> DD-MM-YYYY
    const formatDate = (d) => {
      const [y, m, day] = d.split("-");
      return `${day}-${m}-${y}`;
    };

    // Determine start & end dates
    let startDate, endDate;
    if (date.includes(" ")) {
      const [start, end] = date.split(" ");
      startDate = start;
      endDate = end;
    } else {
      startDate = date;
      endDate = date;
    }

    // Get list of dates between start and end
    const datesList = [];
    let current = moment(startDate);
    const last = moment(endDate);
    while (current.isSameOrBefore(last)) {
      datesList.push(current.format("YYYY-MM-DD"));
      current.add(1, "days");
    }

    // Fetch all records in range
    const records = await ElectricModel.find({
      date: { $gte: startDate, $lte: endDate },
    }).lean();

    // Group records by date
    const recordsByDate = {};
    for (const doc of records) {
      const docDate = doc.date; // YYYY-MM-DD
      if (!recordsByDate[docDate]) recordsByDate[docDate] = [];
      recordsByDate[docDate].push(doc);
    }

    // Process each date separately
    const results = [];

    for (const d of datesList) {
      const docs = recordsByDate[d] || [];

      if (!docs.length) {
        results.push({
          date: formatDate(d),
          message: "No data found",
          powerGeneration: {},
          totalConsumption: {},
          WBSEDCLConsumption: {},
          SOLARConsumption: {},
          COMPRESSORConsumption: {},
        });
        continue;
      }

      // --- accumulators ---
      let powerGeneration = {
        WBSEDCL: 0,
        SOLAR: 0,
        DG: 0,
        WBSEDCL_RH: 0,
        SOLAR_RH: 0,
        DG_RH: 0,
        TOTAL: 0,
      };

      let totalConsumption = {
        WBSEDCL: 0,
        SOLAR: 0,
        SOLAR_LOSS: 0,
        TOTAL: 0,
      };

      let WBSEDCLConsumption = {
        PREP: 0,
        SOLVENT: 0,
        REFINERY: 0,
        DRYER: 0,
        NEW_PLANT: 0,
        OLD_PLANT: 0,
        BOILER: 0,
        PULVERIZER_MEGA: 0,
        PULVERIZER_OILS: 0,
      };

      let SOLARConsumption = { PREP: 0, SOLVENT: 0, REFINERY: 0, BOILER: 0 };

      let COMPRESSORConsumption = {
        ELGI: 0,
        ELGI_SOLAR: 0,
        ELGI_RH: 0,
        KAESER1: 0,
        KAESER1_SOLAR: 0,
        KAESER1_RH: 0,
        KAESER2: 0,
        KAESER2_SOLAR: 0,
        KAESER2_RH: 0,
        REFINERY: 0,
        NEW_PLANT: 0,
        OLD_PLANT: 0,
        BOILER: 0,
      };

      let plantWiseConsumption = {
        PREP_SOLVENT: 0,
        REFINERY: 0,
        RICE_MILL: 0,
        P_S_STEAM: 0,
        R_STEAM: 0,
        R_M_STEAM: 0,
        PREP_SOLVENT_PRODUCTION: 0,
        RICE_MILL_PRODUCTION: 0,
        REFINERY_PRODUCTION: 0,
      };

      let Ton12BoilerConsumption = {
        UNIT: 0,
        UNIT_RH: 0,
        STEAM: 0,
        WATER: 0,
        HUSK: 0,
      };

      let Ton18BoilerConsumption = {
        UNIT: 0,
        UNIT_RH: 0,
        STEAM: 0,
        WATER: 0,
        HUSK: 0,
      };

      // --- aggregate per doc ---
      for (const doc of docs) {
        const pg = doc.PowerGeneration || {};
        powerGeneration.WBSEDCL += pg.WBSEDCL || 0;
        powerGeneration.SOLAR += pg.SOLAR || 0;
        powerGeneration.DG += pg.DG || 0;
        powerGeneration.WBSEDCL_RH += pg.WBSEDCL_RH || 0;
        powerGeneration.SOLAR_RH += pg.SOLAR_RH || 0;
        powerGeneration.DG_RH += pg.DG_RH || 0;
        powerGeneration.TOTAL +=
          (pg.WBSEDCL || 0) + (pg.SOLAR || 0) + (pg.DG || 0);

        const pc = doc.PlantsConsumption || {};
        WBSEDCLConsumption.PREP += pc.Prep?.WBSEDCL || 0;
        WBSEDCLConsumption.SOLVENT += pc.Solvent?.WBSEDCL || 0;
        WBSEDCLConsumption.REFINERY += pc.Refinery?.WBSEDCL || 0;
        WBSEDCLConsumption.DRYER += pc.Dryer?.WBSEDCL || 0;
        WBSEDCLConsumption.NEW_PLANT += pc.NewPlant?.WBSEDCL || 0;
        WBSEDCLConsumption.OLD_PLANT += pc.OldPlant?.WBSEDCL || 0;
        WBSEDCLConsumption.BOILER +=
          (doc.BoilerConsumption?.TF_Boiler?.WBSEDCL || 0) +
          (doc.BoilerConsumption?.TON_12_Boiler?.WBSEDCL || 0) +
          (doc.BoilerConsumption?.TON_18_Boiler?.WBSEDCL || 0);
        WBSEDCLConsumption.PULVERIZER_MEGA += pc.Pulverizer?.WBSEDCL_MEGA || 0;
        WBSEDCLConsumption.PULVERIZER_OILS += pc.Pulverizer?.WBSEDCL_OILS || 0;
        plantWiseConsumption.PREP_SOLVENT += (pc.Prep?.WBSEDCL || 0) + (pc.Prep?.SOLAR || 0) + (pc.Prep?.BOILER_UNIT || 0) + (pc.Solvent?.WBSEDCL || 0) + (pc.Solvent?.SOLAR || 0) + (pc.Solvent?.BOILER_UNIT || 0);
        plantWiseConsumption.REFINERY += (pc.Refinery?.WBSEDCL || 0) + (pc.Refinery?.SOLAR || 0) + (pc.Refinery?.COMPRESSOR || 0) + (pc.Refinery?.BOILER_UNIT || 0);
        plantWiseConsumption.RICE_MILL += (pc.NewPlant?.WBSEDCL || 0) + (pc.NewPlant?.COMPRESSOR || 0) + (pc.OldPlant?.WBSEDCL || 0) + (pc.OldPlant?.COMPRESSOR || 0) + (pc.Dryer?.WBSEDCL || 0) + (pc.Dryer?.BOILER_UNIT || 0);
        plantWiseConsumption.P_S_STEAM += (pc.Prep?.BOILER_STEAM || 0) + (pc.Solvent?.BOILER_STEAM || 0);
        plantWiseConsumption.R_STEAM += (pc.Refinery?.BOILER_STEAM || 0);
        plantWiseConsumption.R_M_STEAM += (pc.Dryer?.BOILER_STEAM || 0);

        SOLARConsumption.PREP += pc.Prep?.SOLAR || 0;
        SOLARConsumption.SOLVENT += pc.Solvent?.SOLAR || 0;
        SOLARConsumption.REFINERY += pc.Refinery?.SOLAR || 0;
        SOLARConsumption.BOILER +=
          (doc.BoilerConsumption?.TF_Boiler?.SOLAR || 0) +
          (doc.BoilerConsumption?.TON_12_Boiler?.SOLAR || 0) +
          (doc.BoilerConsumption?.TON_18_Boiler?.SOLAR || 0);

        const cc = doc.CompressorConsumption || {};
        COMPRESSORConsumption.ELGI += cc.ELGI_WBSEDCL || 0;
        COMPRESSORConsumption.ELGI_SOLAR += cc.ELGI_SOLAR || 0;
        COMPRESSORConsumption.ELGI_RH += cc.ELGI_RH || 0;
        COMPRESSORConsumption.KAESER1 += cc.KAESER_1_WBSEDCL || 0;
        COMPRESSORConsumption.KAESER1_SOLAR += cc.KAESER_1_SOLAR || 0;
        COMPRESSORConsumption.KAESER1_RH += cc.KAESER_1_RH || 0;
        COMPRESSORConsumption.KAESER2 += cc.KAESER_2_WBSEDCL || 0;
        COMPRESSORConsumption.KAESER2_SOLAR += cc.KAESER_2_SOLAR || 0;
        COMPRESSORConsumption.KAESER2_RH += cc.KAESER_2_RH || 0;
        COMPRESSORConsumption.REFINERY += pc.Refinery?.COMPRESSOR || 0;
        COMPRESSORConsumption.NEW_PLANT += pc.NewPlant?.COMPRESSOR || 0;
        COMPRESSORConsumption.OLD_PLANT += pc.OldPlant?.COMPRESSOR || 0;
        COMPRESSORConsumption.BOILER +=
          (doc.BoilerConsumption?.TF_Boiler?.COMPRESSOR || 0) +
          (doc.BoilerConsumption?.TON_12_Boiler?.COMPRESSOR || 0) +
          (doc.BoilerConsumption?.TON_18_Boiler?.COMPRESSOR || 0);

        const pd = doc.Production || {};
        plantWiseConsumption.PREP_SOLVENT_PRODUCTION += pd.BRAN_FEEDING || 0;
        plantWiseConsumption.RICE_MILL_PRODUCTION += pd.PADDY_FEEDING || 0;
        plantWiseConsumption.REFINERY_PRODUCTION += pd.CRUDE_CHARGE || 0;

        Ton12BoilerConsumption.UNIT += (doc.BoilerConsumption?.TON_12_Boiler?.WBSEDCL || 0) + (doc.BoilerConsumption?.TON_12_Boiler?.SOLAR || 0) + (doc.BoilerConsumption?.TON_12_Boiler?.RO || 0) + (doc.BoilerConsumption?.TON_12_Boiler?.COMPRESSOR || 0);
        Ton12BoilerConsumption.UNIT_RH += (doc.BoilerConsumption?.TON_12_Boiler?.RH || 0);
        Ton12BoilerConsumption.STEAM += (doc.BoilerConsumption?.TON_12_Boiler?.STEAM || 0);
        Ton12BoilerConsumption.WATER += (doc.BoilerConsumption?.TON_12_Boiler?.WATER || 0);
        Ton12BoilerConsumption.HUSK += (doc.BoilerConsumption?.TON_12_Boiler?.HUSK || 0);

        Ton18BoilerConsumption.UNIT += (doc.BoilerConsumption?.TON_18_Boiler?.WBSEDCL || 0) + (doc.BoilerConsumption?.TON_18_Boiler?.RO || 0) + (doc.BoilerConsumption?.TON_18_Boiler?.COMPRESSOR || 0);
        Ton18BoilerConsumption.UNIT_RH += (doc.BoilerConsumption?.TON_18_Boiler?.RH || 0);
        Ton18BoilerConsumption.STEAM += (doc.BoilerConsumption?.TON_18_Boiler?.STEAM || 0);
        Ton18BoilerConsumption.WATER += (doc.BoilerConsumption?.TON_18_Boiler?.WATER || 0);
        Ton18BoilerConsumption.HUSK += (doc.BoilerConsumption?.TON_18_Boiler?.HUSK || 0);
      }

      // --- total summary ---
      totalConsumption.WBSEDCL =
        WBSEDCLConsumption.PREP +
        WBSEDCLConsumption.SOLVENT +
        WBSEDCLConsumption.REFINERY +
        WBSEDCLConsumption.DRYER +
        WBSEDCLConsumption.NEW_PLANT +
        WBSEDCLConsumption.OLD_PLANT +
        WBSEDCLConsumption.BOILER +
        WBSEDCLConsumption.PULVERIZER_MEGA + 
        WBSEDCLConsumption.PULVERIZER_OILS +
        COMPRESSORConsumption.ELGI +
        COMPRESSORConsumption.KAESER1 +
        COMPRESSORConsumption.KAESER2;

      totalConsumption.SOLAR =
        SOLARConsumption.PREP +
        SOLARConsumption.SOLVENT +
        SOLARConsumption.REFINERY +
        SOLARConsumption.BOILER +
        COMPRESSORConsumption.ELGI_SOLAR +
        COMPRESSORConsumption.KAESER1_SOLAR +
        COMPRESSORConsumption.KAESER2_SOLAR;

      totalConsumption.SOLAR_LOSS = 0;
        //powerGeneration.SOLAR - totalConsumption.SOLAR;

      totalConsumption.TOTAL =
        totalConsumption.WBSEDCL +
        totalConsumption.SOLAR;
        //totalConsumption.SOLAR_LOSS;

      // --- push result ---
      results.push({
        date: formatDate(d), // DD-MM-YYYY
        powerGeneration,
        totalConsumption,
        WBSEDCLConsumption,
        SOLARConsumption,
        COMPRESSORConsumption,
        plantWiseConsumption,
        Ton12BoilerConsumption,
        Ton18BoilerConsumption, // ✅ Added here
      });
    }

    // ✅ Final response
    res.json({ data: results });
  } catch (err) {
    console.error("❌ Error in getElectricDashboard:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};






