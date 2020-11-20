
const form_inputs = [
    {
        label: "Person name",
        name: "person_name",
        type: "text",
        value: null,
        rules: "required|min:3|max:64",
        options: [],
        default_value: null,
        multiple: false,
        readonly: false,
        placeholder: "Person name",
        info: "Example value of how to fill the input"
    },
    {
        label: "Country",
        name: "country",
        type: "select",
        value: null,
        rules: "required|min:2|max:64",
        options: [
            {
                label: "Albania",
                value: "albania"
            },
            {
                label: "Italy",
                value: "italy"
            }
        ],
        default_value: "albania",
        multiple: false,
        readonly: false,
        placeholder: "select",
        info: "Example value of how to fill the input"
    }
]

const initRoutes = (app) => {
    app.get('/api/formjson', async (req, res) => {
        res.json(form_inputs);
    });
    app.post('/api/formjson', async (req, res) => {
        res.json({ "status": "success" });
    });
}

module.exports = {
    initRoutes
}
