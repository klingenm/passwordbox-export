window.MK = {};
(function (module) {
  /**
   * Simple wrapping function that allows me to inject code when a certain methon or function is called.
   **/
  function wrap(tag, functionToPatch, functionScope, halt) {
    functionScope = functionScope || this;
    var wrapper = function () {
      var args = Array.prototype.slice.apply(arguments, [0]);
      var result = wrapper.orig.apply(functionScope, args);
      console.log(tag, args, result);
      if (halt) {
        debugger;
      }
      return result;
    };
    wrapper.orig = functionToPatch;
    return wrapper;
  }

  // This is what I did to figure out how to get the records. I started with the global scope and found the PB
  // namespace and the interresting looking Crypto "module". Halting the in the decrypt method with a debugger statement
  // gave me a stack frame where I could find other "namespaces". This in turn pointed me to the "assets" in the
  // FA.Background namespace.
  //PB.Crypto.PBKDF2.derive = wrap('PBKDF2', PB.Crypto.PBKDF2.derive, this);
  //PB.crypto.AES.decrypt = wrap('AES', PB.crypto.AES.decrypt, this, true);

  function getDecryptedRecords() {
    var records = [];
    FA.Background.assets.models.forEach(function (item) {
      if (!item.belongsToMe()) {
        return;
      }

      if (item.attributes.memo_k) {
        var clearText = FA.Background.decryptWithAES(item.attributes.memo_k);
        if (FA.isJson(clearText)) {
          item.attributes.memo = JSON.parse(clearText);
        } else {
          item.attributes.memo = clearText;
        }
      }

      if (item.attributes.password_k) {
        item.attributes.password = FA.Background.decryptWithAES(item.attributes.password_k);
      }

      records.push(item.attributes);
    });
    console.log('Extracted ' + records.length + ' records from your database.');
    return records;
  }

  function arrayToCsvRow(cols) {
    // TODO(klingenm): Escape " properly.
    return cols.map(function (col) {
      if (col.indexOf(',') !== -1 || col.indexOf('"') !== -1 || col.indexOf(' ') !== -1) {
        return '"' + col + '"';
      } else {
        return col;
      }
    }).join(', ');
  }

  function isLoggedIn() {
    return FA.Background.fa_login !== null;
  }

  function requireLogin() {
    if (!isLoggedIn()) {
      throw new Error('You are not logged in to the PasswordBox extension. Login and try again.');
    }
  }

  function warnOnVersion() {
    if (FA_version !== '1.38.9.4120') {
      console.warn('You are running PasswordBox ' + FA_version + '. This has only been tested on 1.38.9.4120');
    }
  }

  /**
   * Generic export which returns the exported data as CSV. Default behavior is that all fiedls are exported and field
   * names are written on the first row.
   *
   * Export can be configured with a config object. It has support for the following propeties:
   *  - cols; an array with the names of the fields, in the order wanted. Supported fields are; name, url, login,
   *    password, created_at, detail, domain, memo, type, updated_at, virtual_password, id, member_id.
   *  - includeHeader; a bool that contols rendering of column headers.
   *
   * @returns {string} Exported data as CSV string.
   **/
  function exportCsv(config) {
    requireLogin();
    warnOnVersion();

    config = config || {};
    var cols = config.cols || ['name', 'url', 'login', 'password', 'created_at', 'details', 'domain', 'memo', 'type'];
    var rows = config.includeHeader ? [arrayToCsvRow(cols)] : [];
    return rows.concat(getDecryptedRecords().map(function (item) {
      return arrayToCsvRow(cols.map(function (colName) {
        if (item.hasOwnProperty(colName) && item[colName]) {
          if (typeof item[colName] === 'string') {
            return item[colName];
          } else {
            return JSON.stringify(item[colName]);
          }
        } else {
          return '';
        }
      }));
    })).join('\n');
  }

  /**
   * Customized export that can be imported into 1Password Version 4.4.2 (442010).
   *
   * @returns {string} Exported data as CSV string.
   **/
  function exportFor1Password() {
    return exportCsv({cols: ['name', 'url', 'login', 'password'], includeHeader: false});
  }

  function exportCsvToClipboard(config) {
    PB.Utility.setClipboardText(exportCsv(config));
    console.log('Exported result to clipboard.');
  }

  function exportFor1PasswordToClipboard() {
    PB.Utility.setClipboardText(exportCsv());
    console.log('Exported result to clipboard.');
  }

  // Export public API.
  module.exportCsv = exportCsv;
  module.exportFor1Password = exportFor1Password;
  module.exportCsvToClipboard = exportCsvToClipboard;
  module.exportFor1PasswordToClipboard = exportFor1PasswordToClipboard;
})(window.MK);
