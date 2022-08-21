import { useRouter } from "next/router";
import Link from 'next/link';
import styles from '../../styles/Scenario.module.scss';
import axios from 'axios';
import { useEffect, useState } from "react";
import template from '../../lib/template.json';

export default function Scenario() {
    let { sid } = useRouter().query;
    let [scenario, setScenario] = useState(undefined);

    useEffect(() => loadScenario(), []);

    const loadScenario = () => {
        axios.get("/api/scenario?name=" + sid).then(resp => setScenario(resp.data));
    }

    const editScenario = (fb, v) => {
        let tmp = { ...scenario };
        tmp[fb] = v;

        setScenario(tmp);
    }

    const saveScenario = async () => {
        await axios.post("/api/scenario?name=" + sid, scenario);
        loadScenario();
    }

    return (
        <>
            <Link href={"/"}><i className={styles.arrow}></i></Link>

            <div className={styles.page}>
                {scenario ? (
                    <div className={styles.list}>
                        <button className={styles.savebtn} onClick={saveScenario}>Save Scenario</button>
                        {Object.keys(template).map(v => <InputBox key={v} fb={v} data={scenario[v]} editScenario={editScenario} />)}
                    </div>
                ) : (
                    <p style={{ textAlign: "center" }}>Loading...</p>
                )}
            </div>
        </>
    );
}

function InputBox({ fb, data, editScenario }) {
    let title = fb.split("_").map(v => v.charAt(0).toUpperCase() + v.substring(1)).join(" ");
    let vector = template[fb];

    const formatText = (str) => {
        // Convert to array
        if (str.indexOf(",") > -1) return str.substring(5).split(",").map(v => isNaN(v) ? v.trim() : Number(v));

        // Convert to number
        if (!isNaN(str)) return Number(str);

        // Just string
        return str.trim();
    }

    const formatObj = (obj) => {
        if (typeof obj === "object") return obj.join(",");

        return String(obj);
    }

    const onSave = (e) => {
        e.preventDefault();

        if (vector.length === 0) {
            let k = e.target[fb].value;

            editScenario(fb, formatText(k));
        }
        else {
            let ret = [];

            out: for (let i = 0; ; i++) {
                let tmp = {};

                for (let v of vector) {
                    if (!e.target.hasOwnProperty(v + "_" + i)) break out;

                    let k = e.target[v + "_" + i].value;
                    tmp[v] = formatText(k);
                }

                ret.push(tmp);
            }

            editScenario(fb, ret);
        }
    }

    const addLine = (e) => {
        e.preventDefault();

        let tmp = [...data];
        let obj = {};

        for (let v of vector) obj[v] = "";

        tmp.push(obj);
        editScenario(fb, tmp);
    }

    const deleteLine = (e) => {
        e.preventDefault();

        let tmp = [...data];
        tmp.pop();

        editScenario(fb, tmp);
    }

    if (vector.length === 0) return (
        <form className={styles.single} onSubmit={onSave}>
            <div>
                <h2>{title}</h2>
                <button>Save</button>
            </div>

            <h3>{fb}</h3>

            <input name={fb} defaultValue={formatObj(data)} />
        </form>
    );

    return (
        <form className={styles.multiple} onSubmit={onSave}>
            <div name="title">
                <h2>{title}</h2>
                <button>Save</button>
                <button onClick={addLine}>Add</button>
                <button onClick={deleteLine}>Delete</button>
            </div>

            <h3>{fb}</h3>

            <div name="grid" style={{ gridTemplateColumns: new Array(vector.length).fill("1fr").join(" ") }}>
                {vector.map((v, i) => <label style={{ borderRight: i === vector.length - 1 ? undefined : "1px solid black" }} key={v}>{v}</label>)}

                {data.map((v, i) => vector.map((k, ii) => <input style={{ borderRight: ii === vector.length - 1 ? undefined : "1px solid black", borderBottom: i === data.length - 1 ? undefined : "1px solid black" }} key={k + i} name={k + "_" + i} defaultValue={formatObj(v[k])} />))}
            </div>
        </form>
    );
}