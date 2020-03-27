dataSource = {
    columns: [{
            id: 'id',
            label: "Id",
            isSort: true,
            isResizable: true,
            width: "50px",
        },
        {
            id: 'employee_name',
            label: "Employee name",
            isSort: true,
            isResizable: true,
            width: "40",
        },
        {
            id: 'employee_salary',
            label: "Salary",
            isResizable: true,
            isSort: true,
        },
        {
            id: 'employee_age',
            label: "Age",
            isSort: false,
            isResizable: true,
            width: "10"
        }
    ],
    data: [],
    api: 'http://5b0f708f3c5c110014145cc9.mockapi.io/api/nexacro-demo'
}