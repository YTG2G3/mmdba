import xlsx from 'xlsx-js-style';

export default function docToFlat(doc) {
    // Setup arrays
    let scenarioArr = [
        ["Details", "", "", "", "Dialogue", "", "Inflow", "", "", "", "", "Outflow", "", "", "", "", "Assets", "", "", "", "Liabilities", "", "", "",],
        ["Theme", "Level", "Role", "Rounds", "Intro", "Image", "Type", "Item", "Amount", "%", "Image", "Type", "Item", "Amount", "%", "Image", "Type", "Item", "Amount", "Image", "Type", "Item", "Amount", "Image"]
    ];

    let roundArr = [
        ["Inflow", "", "Outflow", "", "Event", "", "Assets", "", "", "", "", "Liabilities", "", "Dialogue", ""],
        ["Active Fixed", "Active Variable", "Essential", "Periodic", "Event ID", "Value", "Dynamic", "Dynamic", "Dynamic", "Static", "Static", "Static", "Dynamic", "Intro", "Outro"],
        ["Wages", "", "Weekly", "Monthly", "", "", "MentaCards", "MentaBlocks", "Toy Trains", "Car", "Savings", "Loan", "Credit Card", "", ""]
    ];

    let eventArr = [
        ["Game", "", "Details", "", "", "", ""],
        ["Round", "Cost", "Event ID", "Category", "Descriptor", "Dialogue", "Image"]
    ];

    // Scenario
    let scenarioCnt = Math.max(1, doc.scenario_dialogue.length, doc.scenario_inflow.length, doc.scenario_outflow.length, doc.scenario_assets.length, doc.scenario_liabilities.length);

    for (let i = 0; i < scenarioCnt; i++) scenarioArr.push(new Array(24).fill(""));

    scenarioArr[2][0] = doc.scenario_theme;
    scenarioArr[2][1] = doc.scenario_level;
    scenarioArr[2][2] = doc.scenario_role;
    scenarioArr[2][3] = doc.scenario_rounds;

    for (let i in doc.scenario_dialogue) {
        scenarioArr[i + 2][4] = doc.scenario_dialogue[i].intro;
        scenarioArr[i + 2][5] = doc.scenario_dialogue[i].image;
    }

    for (let i in doc.scenario_inflow) {
        scenarioArr[i + 2][6] = doc.scenario_inflow[i].type;
        scenarioArr[i + 2][7] = doc.scenario_inflow[i].item;
        scenarioArr[i + 2][8] = doc.scenario_inflow[i].amount;
        scenarioArr[i + 2][9] = doc.scenario_inflow[i].percentage;
        scenarioArr[i + 2][10] = doc.scenario_inflow[i].image;
    }

    for (let i in doc.scenario_outflow) {
        scenarioArr[i + 2][11] = doc.scenario_outflow[i].type;
        scenarioArr[i + 2][12] = doc.scenario_outflow[i].item;
        scenarioArr[i + 2][13] = doc.scenario_outflow[i].amount;
        scenarioArr[i + 2][14] = doc.scenario_outflow[i].percentage;
        scenarioArr[i + 2][15] = doc.scenario_outflow[i].image;
    }

    for (let i in doc.scenario_assets) {
        scenarioArr[i + 2][16] = doc.scenario_assets[i].type;
        scenarioArr[i + 2][17] = doc.scenario_assets[i].item;
        scenarioArr[i + 2][18] = doc.scenario_assets[i].amount;
        scenarioArr[i + 2][19] = doc.scenario_assets[i].image;
    }

    for (let i in doc.scenario_liabilities) {
        scenarioArr[i + 2][20] = doc.scenario_liabilities[i].type;
        scenarioArr[i + 2][21] = doc.scenario_liabilities[i].item;
        scenarioArr[i + 2][22] = doc.scenario_liabilities[i].amount;
        scenarioArr[i + 2][23] = doc.scenario_liabilities[i].image;
    }

    // Round
    let roundCnt = doc.scenario_rounds;

    for (let i = 0; i < roundCnt; i++) roundArr.push(new Array(15).fill(""));

    for (let i in doc.round_inflow_fixed) roundArr[i + 3][0] = doc.round_inflow_fixed[i];
    for (let i in doc.round_inflow_variable) roundArr[i + 3][1] = doc.round_inflow_variable[i];

    for (let i in doc.round_outflow_weekly) roundArr[i + 3][2] = doc.round_outflow_weekly[i];
    for (let i in doc.round_outflow_monthly) roundArr[i + 3][3] = doc.round_outflow_monthly[i];

    for (let i in doc.round_event_id) roundArr[i + 3][4] = doc.round_event_id[i];
    for (let i in doc.round_event_value) roundArr[i + 3][5] = doc.round_event_value[i];

    for (let i in doc.round_assets_mentacards) roundArr[i + 3][6] = doc.round_assets_mentacards[i];
    for (let i in doc.round_assets_mentablocks) roundArr[i + 3][7] = doc.round_assets_mentablocks[i];
    for (let i in doc.round_assets_toytrains) roundArr[i + 3][8] = doc.round_assets_toytrains[i];
    for (let i in doc.round_assets_car) roundArr[i + 3][9] = doc.round_assets_car[i];
    for (let i in doc.round_assets_savings) roundArr[i + 3][10] = doc.round_assets_savings[i];

    for (let i in doc.round_liabilities_loan) roundArr[i + 3][11] = doc.round_liabilities_loan[i];
    for (let i in doc.round_liabilities_creditcard) roundArr[i + 3][12] = doc.round_liabilities_creditcard[i];

    for (let i in doc.round_dialogue_intro) roundArr[i + 3][13] = doc.round_dialogue_intro[i];
    for (let i in doc.round_dialogue_outro) roundArr[i + 3][14] = doc.round_dialogue_outro[i];

    // Event
    for (let e of doc.event) eventArr.push([e.round, e.cost, e.id, e.category, e.descriptor, e.dialogue, e.image]);

    // Conversion
    scenarioArr = scenarioArr.map((v, i) => v.map(vv => i === 0 ? title(vv) : i === 1 ? header(vv) : normal(vv)));
    roundArr = roundArr.map((v, i) => v.map(vv => i === 0 ? title(vv) : i === 1 || i === 2 ? header(vv) : normal(vv)));
    eventArr = eventArr.map((v, i) => v.map(vv => i === 0 ? title(vv) : i === 1 ? header(vv) : normal(vv)));

    // Flat file
    let wb = xlsx.utils.book_new();

    let _scenario = xlsx.utils.aoa_to_sheet(scenarioArr);
    let _round = xlsx.utils.aoa_to_sheet(roundArr);
    let _event = xlsx.utils.aoa_to_sheet(eventArr);

    // Width
    _scenario["!cols"] = new Array(24).fill({ wch: 10 });

    _round["!cols"] = [
        { wch: 15 }, { wch: 15 },
        { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 },
        { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 },
        { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 },
    ];

    _event["!cols"] = new Array(7).fill({ wch: 10 });

    // Merge
    _scenario["!merges"] = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: 3 } },
        { s: { r: 0, c: 4 }, e: { r: 0, c: 5 } },
        { s: { r: 0, c: 6 }, e: { r: 0, c: 10 } },
        { s: { r: 0, c: 11 }, e: { r: 0, c: 15 } },
        { s: { r: 0, c: 16 }, e: { r: 0, c: 19 } },
        { s: { r: 0, c: 20 }, e: { r: 0, c: 23 } }
    ];

    _round["!merges"] = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: 1 } },
        { s: { r: 0, c: 2 }, e: { r: 0, c: 3 } },
        { s: { r: 0, c: 4 }, e: { r: 0, c: 5 } },
        { s: { r: 0, c: 6 }, e: { r: 0, c: 10 } },
        { s: { r: 0, c: 11 }, e: { r: 0, c: 12 } },
        { s: { r: 0, c: 13 }, e: { r: 0, c: 14 } }
    ]

    _event["!merges"] = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: 1 } },
        { s: { r: 0, c: 2 }, e: { r: 0, c: 6 } }
    ]

    // Export
    xlsx.utils.book_append_sheet(wb, _scenario, "Scenario");
    xlsx.utils.book_append_sheet(wb, _round, "Round");
    xlsx.utils.book_append_sheet(wb, _event, "Event");

    let buffer = xlsx.write(wb, { bookType: 'xlsx', type: "array" })

    return buffer;
}

const defstyle = {
    alignment: { horizontal: "center" },
    border: {
        top: { style: "medium", color: { rgb: "000000" } },
        bottom: { style: "medium", color: { rgb: "000000" } },
        left: { style: "medium", color: { rgb: "000000" } },
        right: { style: "medium", color: { rgb: "000000" } }
    },
    font: { name: "Calibri", sz: 11, color: { rgb: "FFFFFF" } }
}

function title(str) {
    return { v: str, t: "s", s: { ...defstyle, fill: { bgColor: { rgb: "6027CE" } } } };
}

function header(str) {
    return { v: str, t: "s", s: { ...defstyle, fill: { bgColor: { rgb: "5FAF57" } } } };
}

function normal(str) {
    return { v: str, t: "s", s: { font: { name: "Calibri", sz: 11, color: { rgb: "000000" } } } };
}