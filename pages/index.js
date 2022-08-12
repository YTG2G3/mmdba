import styles from '../styles/Home.module.scss';
import Select from 'react-dropdown-select';
import axios from 'axios';
import { useEffect, useState } from 'react';
import docToTable from '../lib/doc_to_flat';
import template from '../lib/template.json';
import FileSaver from 'file-saver';

export default function Home() {
    let [scenarios, setScenarios] = useState(undefined);
    let [scenario, setScenario] = useState(undefined);

    useEffect(() => loadScenarios(), []);

    const loadScenarios = () => {
        setScenarios(undefined);
        setScenario(undefined);

        axios.get("/api/scenario").then(resp => setScenarios(resp.data));
    }

    const loadScenario = async (v) => {
        let resp = await axios.get("/api/scenario?name=" + v[0].sid);

        setScenario(resp.data);
    }

    const deleteScenario = async () => {
        await axios.delete("/api/scenario?name=" + scenario.sid);

        loadScenarios();
    }

    const addScenario = async () => {
        await axios.post("api/scenario", template);

        loadScenarios();
    }

    const downloadScenario = () => {
        let buffer = docToTable(scenario);
    }

    return (
        <div className={styles.page}>
            <div className={styles.menu}>
                <Select
                    loading={!Boolean(scenarios)}
                    disabled={!Boolean(scenarios)}
                    labelField="sid"
                    valueField="sid"
                    style={{ margin: 0 }}
                    options={scenarios ? scenarios.map(v => ({ sid: v })) : undefined}
                    onChange={loadScenario}
                />

                <button onClick={addScenario} className={styles.ss}>Add New...</button>

                {scenario ? (
                    <div className={styles.btns}>
                        <button onClick={downloadScenario}>Download Spreadsheet</button>
                        <button>Upload Spreadsheet</button>
                        <button onClick={deleteScenario} style={{ backgroundColor: "#FF7E6B" }}>Remove</button>
                    </div>
                ) : undefined}
            </div>
        </div >
    );
}