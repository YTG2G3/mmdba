import { scenario } from "../../lib/firebase";

export default async function handler(req, res) {
    if (req.method === 'GET') {
        let scenarioName = req.query.name;

        if (scenarioName) {
            let doc = await scenario.doc(scenarioName).get();

            if (doc.exists) res.status(200).json({ ...doc.data(), sid: scenarioName });
            else res.status(400).end();
        }
        else {
            let docs = await scenario.listDocuments();
            res.status(200).json(docs.map(v => v.id));
        }
    }
    else if (req.method === 'POST') {
        let scenarioName = req.query.name;

        await scenario.doc(scenarioName).set(req.body);

        res.status(200).end();
    }
    else if (req.method === 'DELETE') {
        let scenarioName = req.query.name;
        if (!scenarioName) return res.status(400).end();

        await scenario.doc(scenarioName).delete();

        res.status(200).end();
    }
}