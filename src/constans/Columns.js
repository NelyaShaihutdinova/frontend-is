export const COLUMNS = [
    {
        Header: 'id',
        accessor: 'id',
    },
    {
        Header: 'name',
        accessor: 'name',
    },
    {
        Header: 'Coordinates',
        columns: [
            {
                Header: 'x',
                accessor: 'coordinates_x',
            },
            {
                Header: 'y',
                accessor: 'coordinates_y',
            },
        ],
    },
    {
        Header: 'creationDate',
        accessor: 'creationDate',
    },
    {
        Header: 'Person',
        columns: [
            {
                Header: 'eyeColor',
                accessor: 'eyeColor',
            },
            {
                Header: 'hairColor',
                accessor: 'hairColor',
            },
            {
                Header: 'Location',
                columns: [
                    {
                        Header: 'x',
                        accessor: 'x',
                    },
                    {
                        Header: 'y',
                        accessor: 'y',
                    },
                    {
                        Header: 'z',
                        accessor: 'z',
                    },
                ],
            },
            {
                Header: 'weight',
                accessor: 'weight',
            },
        ],
    },
    {
        Header: 'Event',
        columns: [
            {
                Header: 'id',
                accessor: 'event_id',
            },
            {
                Header: 'name',
                accessor: 'event_name',
            },
            {
                Header: 'ticketCount',
                accessor: 'ticketCount',
            },
            {
                Header: 'eventType',
                accessor: 'eventType',
            },
        ],
    },
    {
        Header: 'price',
        accessor: 'price',
    },
    {
        Header: 'type',
        accessor: 'type',
    },
    {
        Header: 'discount',
        accessor: 'discount',
    },
    {
        Header: 'number',
        accessor: 'number',
    },
    {
        Header: 'comment',
        accessor: 'comment',
    },
    {
        Header: 'refundable',
        accessor: 'refundable',
    },
    {
        Header: 'Venue',
        columns: [
            {
                Header: 'id',
                accessor: 'venue_id',
            },
            {
                Header: 'name',
                accessor: 'venue_name',
            },
            {
                Header: 'capacity',
                accessor: 'capacity',
            },
            {
                Header: 'type',
                accessor: 'venue_type',
            },
        ],
    },
];