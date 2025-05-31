import { useState, useEffect } from "react";

const DataForm = ({ onSuccess }) => {
    const [input, setInput] = useState("");

    const handleSubmit = (e) => {
        if (!input.length) {
            alert("enter a name!");
        }
        e.preventDefault();
        fetch("/api/data", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ "name": input })
        })
            .then((res) => res.json())
            .then((res) => {
                if (res.status === "ok") {
                    setInput("");
                    if (onSuccess) onSuccess();
                } else {
                    alert("Error: " + (res.error || "Unknown error"));
                }
            })
            .catch((err) => alert("Network error: " + err));
    };

    return (
        <form onSubmit={handleSubmit}>
            <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder='Enter JSON, e.g. {"name":"Alice"}'
                rows={4}
                cols={40}
            />
            <br />
            <button type="submit">Submit</button>
        </form>
    );
}
export default DataForm;
