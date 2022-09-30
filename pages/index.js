import styles from '../styles/Home.module.scss';
import Select from 'react-dropdown-select';
import axios from 'axios';
import { useEffect, useState } from 'react';
import template from '../lib/template.json';
import Link from 'next/link';

export default function Home() {
    let [scenarios, setScenarios] = useState(undefined);
    let [scenario, setScenario] = useState(undefined);

    useEffect(() => loadScenarios(), []);

    const loadScenarios = () => {
        setScenarios(undefined);
        setScenario(undefined);

        axios.get("/api/scenario").then(resp => setScenarios(resp.data));
    }

    const deleteScenario = async () => {
        await axios.delete("/api/scenario?name=" + scenario);

        loadScenarios();
    }

    const addScenario = async () => {
        let name = prompt("What will be the name of the scenario?");

        if (!name) return;

        let tmp = {};

        for (let v of Object.keys(template)) {
            let d = template[v];
            tmp[v] = d.length === 0 ? "" : [];
        }

        await axios.post("api/scenario?name=" + name, tmp);

        loadScenarios();
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
                    onChange={(v) => setScenario(v[0].sid)}
                />

                <button onClick={addScenario} className={styles.ss}>Add New...</button>

                {scenario ? (
                    <div className={styles.btns}>
                        <Link href={`/scenario/${scenario}`}><a>Edit Scenario</a></Link>
                        <button onClick={deleteScenario} style={{ backgroundColor: "#FF7E6B" }}>Remove</button>
                    </div>
                ) : undefined}
            </div>
        </div >
    );
}