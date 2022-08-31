const onDemandMapLayers = [
  {
    'category': 'Fire and Burned Area',
    'id': 'd54b3d08-69fe-40ec-9fb2-7518b4739b2b',
    'source': 'FMA',
    'domain': 'Environment',
    'requests': [
      {
        'parameters': {
          'param_1': 'foo',
          'param_2': 'bar',
          'param_3': 'baz'
        },
        'layers': [
          {
            'id': 'dfab8727-c07f-4038-afe4-ff3a39ee65aa',
            'url': 'https://geoserver-test.safers-project.cloud/geoserver/ermes/wms?time=2022-06-30T01%3A00%3A00Z&layers=ermes:33101_t2m_33001_f4a79afe-db64-4cfe-9dec-324837e69d82&service=WMS&request=GetMap&srs=EPSG%3A4326&bbox=21.816207866585803,39.73008423176292,24.146760001844196,41.49921771792108&width=256&height=256&format=image%2Fpng'
          }
        ],
        'status': 'status',
        'id': 'f143b4c3-112f-403f-bab1-dc89d4576336'
      },
      {
        'parameters': {
          'param_1': 'red',
          'param_2': 'green',
          'param_3': 'blue'
        },
        'layers': [
          {
            'id': '3af85138-dc3b-4b5d-bece-2f6310d0b4e8',
            'url': 'https://geoserver-test.safers-project.cloud/geoserver/ermes/wms?time=2022-06-30T01%3A00%3A00Z&layers=ermes:33101_t2m_33001_f4a79afe-db64-4cfe-9dec-324837e69d82&service=WMS&request=GetMap&srs=EPSG%3A4326&bbox=21.816207866585803,39.73008423176292,24.146760001844196,41.49921771792108&width=256&height=256&format=image%2Fpng'
          }
        ],
        'status': 'status',
        'id': '3f3123b1-1488-4910-8d78-b4601f95731f'
      }
    ]
  },
  {
    'category': 'Post Event Monitoring ',
    'id': 'bbfecae7-482f-4df4-83fc-e1eb9f48cbec',
    'source': 'CIMA',
    'domain': 'Weather',
    'requests': [
      {
        'parameters': {
          'latitude': '14.5',
          'longitude': '39.75',
          'zoom': 12
        },
        'layers': [
          {
            'id': 'dfab8727-c07f-4038-afe4-ff3a39ee65aa',
            'url': 'https://geoserver-test.safers-project.cloud/geoserver/ermes/wms?time=2022-06-30T01%3A00%3A00Z&layers=ermes:33101_t2m_33001_f4a79afe-db64-4cfe-9dec-324837e69d82&service=WMS&request=GetMap&srs=EPSG%3A4326&bbox=21.816207866585803,39.73008423176292,24.146760001844196,41.49921771792108&width=256&height=256&format=image%2Fpng'
          }
        ],
        'status': 'live',
        'id': '0ff5314b-e512-4510-bb99-54adcad3e997'
      },
      {
        'parameters': {
          'param_1': 'red',
          'param_2': 'green',
          'param_3': 'blue'
        },
        'layers': [
          {
            'id': 'f7368a33-d8cf-4c94-a888-bd3e5c5de242',
            'url': 'https://geoserver-test.safers-project.cloud/geoserver/ermes/wms?time=2022-06-30T01%3A00%3A00Z&layers=ermes:33101_t2m_33001_f4a79afe-db64-4cfe-9dec-324837e69d82&service=WMS&request=GetMap&srs=EPSG%3A4326&bbox=21.816207866585803,39.73008423176292,24.146760001844196,41.49921771792108&width=256&height=256&format=image%2Fpng'
          }
        ],
        'status': 'status',
        'id': '4785d521-4bc6-45af-b05b-5d903d94d12a'
      }
    ]
  },
  {
    'category': 'Wildfire Simulation',
    'id': '34272b4c-89f8-4c74-a046-0e980f34af3e',
    'source': 'RISC',
    'domain': 'Environment',
    'requests': [
      {
        'parameters': {
          'param_1': 'yellow',
          'param_2': 'green',
          'param_3': 'brown',
          'param_4': 'blue',
          'param_5': 'pink',
          'param_6': 'black',
        },
        'layers': [
          {
            'id': 'd27643eb-7ea7-4597-9d6c-874c0b1f58db',
            'url': 'https://geoserver-test.safers-project.cloud/geoserver/ermes/wms?time=2022-06-30T01%3A00%3A00Z&layers=ermes:33101_t2m_33001_f4a79afe-db64-4cfe-9dec-324837e69d82&service=WMS&request=GetMap&srs=EPSG%3A4326&bbox=21.816207866585803,39.73008423176292,24.146760001844196,41.49921771792108&width=256&height=256&format=image%2Fpng'
          }
        ],
        'status': 'status',
        'id': '67c6d620-a549-4c19-bd51-b721e1797ed3'
      },
    ]
  },
];

export {
  onDemandMapLayers,
};