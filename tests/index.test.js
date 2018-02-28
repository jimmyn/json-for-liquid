const Parser = require('../src');

let parser;

const data = {
  'name': '<discount_name1>',
  'discounts': [{
    'id': 123456789,
    'name': '<discount_name1>',
    'price': '<discount_price1>',
    'resourceType': '<discount_resource_type1>',
    'type': '<discount_value_type1>',
    'increments': '<discount_increment1>',
    'volumeBreaks': [{
      'lowerLimit': '<volume_break_lowerLimit1>',
      'upperLimit': '<volume_break_upperLimit1>',
      'value': '<volume_break_value1>'
    }, {
      'lowerLimit': '<volume_break_lowerLimit2>',
      'upperLimit': '<volume_break_upperLimit2>',
      'value': '<volume_break_value2>'
    }]
  }, {
    'id': 987654321,
    'name': '<discount_name2>',
    'price': '<discount_price2>',
    'resourceType': '<discount_resource_type2>',
    'type': '<discount_value_type2>',
    'increments': '<discount_increment2>',
    'volumeBreaks': [{
      'lowerLimit': '<volume_break_lowerLimit1>',
      'upperLimit': '<volume_break_upperLimit1>',
      'value': '<volume_break_value1>'
    }, {
      'lowerLimit': '<volume_break_lowerLimit2>',
      'upperLimit': '<volume_break_upperLimit2>',
      'value': '<volume_break_value2>'
    }]
  }],
  'customerIds': '<customer_ids>'
};

const schema = {
  name: {type: 'string'},
  discounts: {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        id: {type: 'integer'},
        name: {type: 'string'},
        price: {type: 'string'},
        resourceType: {type: 'string'},
        type: {type: 'string'},
        increments: {type: 'string'},
        volumeBreaks: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              lowerLimit: {type: 'string'},
              upperLimit: {type: 'string'},
              value: {type: 'string'}
            }
          }
        }
      }
    }
  },
  customerIds: {type: 'string'}
};

const stringifiedData = '<discount_name1>{0}123456789{1}<discount_name1>{1}<discount_price1>{1}<discount_resource_type1>{1}<discount_value_type1>{1}<discount_increment1>{1}<volume_break_lowerLimit1>{2}<volume_break_upperLimit1>{2}<volume_break_value1>[1]<volume_break_lowerLimit2>{2}<volume_break_upperLimit2>{2}<volume_break_value2>[0]987654321{1}<discount_name2>{1}<discount_price2>{1}<discount_resource_type2>{1}<discount_value_type2>{1}<discount_increment2>{1}<volume_break_lowerLimit1>{2}<volume_break_upperLimit1>{2}<volume_break_value1>[1]<volume_break_lowerLimit2>{2}<volume_break_upperLimit2>{2}<volume_break_value2>{0}<customer_ids>';

beforeAll(() => {
  parser = new Parser({schema});
});

describe('Serializer', () => {
  it('should stringify data', () => {
    expect(parser.stringify(data)).toEqual(stringifiedData);
  });

  it('should parse data', () => {
    expect(parser.parse(stringifiedData)).toEqual(data);
  });
});
