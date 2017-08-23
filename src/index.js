class Parser {

  constructor(config = {}) {
    const defaultConfig = {
      objectDelimiters: ['{0}', '{1}', '{2}'],
      arrayDelimiters: ['[0]', '[1]', '[2]']
    };
    this.config = Object.assign({}, defaultConfig, config);
    if (!config.schema) {
      throw 'Schema is required';
    }
  }

  _getDelimiter(type, level) {
    if (type === 'array' && this.config.arrayDelimiters[level]) {
      return this.config.arrayDelimiters[level];
    }
    if (type === 'object' && this.config.objectDelimiters[level]) {
      return this.config.objectDelimiters[level];
    }
    throw `No ${type} delimiter specified for level ${level}`;
  }

  _stringifyArray(array = [], items, level) {
    const delimiter = this._getDelimiter('array', level);
    let output;
    const dataType = items.type;
    switch (dataType) {
      case 'object':
        output = array.map(item =>
          this._stringifyObject(item, items.properties, level + 1)
        );
        break;
      case 'array':
        output = array.map(item =>
          this._stringifyArray(item, items.items, level + 1)
        );
        break;
      default:
        output = array;
    }
    return output.join(delimiter);
  }

  _parseArray(string = '', items, level) {
    const delimiter = this._getDelimiter('array', level);
    const array = string.split(delimiter);
    const dataType = items.type;
    let output;
    switch (dataType) {
      case 'object':
        output = array.map(item =>
          this._parseObject(item, items.properties, level + 1)
        );
        break;
      case 'array':
        output = array.map(item =>
          this._parseArray(item, items.items, level + 1)
        );
        break;
      default:
        output = array;
    }
    return output;
  }

  _stringifyObject(object = {}, properties, level = 0) {
    const delimiter = this._getDelimiter('object', level);
    let output = Object.keys(properties).map(key => {
      const dataType = properties[key].type;
      switch (dataType) {
        case 'string':
          return object[key];
        case 'object':
          return this._stringifyObject(
            object[key],
            properties[key].properties,
            level + 1
          );
        case 'array':
          return this._stringifyArray(
            object[key],
            properties[key].items,
            level
          );
      }
    });
    return output.join(delimiter);
  }

  _parseObject(string = '', properties, level = 0) {
    const delimiter = this._getDelimiter('object', level);
    const objectArray = string.split(delimiter);
    const result = {};
    Object.keys(properties).forEach((key, i) => {
      const dataType = properties[key].type;
      switch (dataType) {
        case 'object':
          result[key] = this._parseObject(
            objectArray[i],
            properties[key].properties,
            level + 1
          );
          break;
        case 'array':
          result[key] = this._parseArray(
            objectArray[i],
            properties[key].items,
            level
          );
          break;
        default:
          result[key] = objectArray[i];
      }
    });
    return result;
  }

  stringify(data) {
    return this._stringifyObject(data, this.config.schema);
  }

  parse(string) {
    return this._parseObject(string, this.config.schema);
  }
}

module.exports = Parser;
