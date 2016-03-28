# Export for PasswordBox Chrome plugin
To cover for the lack of an export function in PasswordBox, here is a "hack" you're welcome to use if you want to export your passwords to another password manager. We have written 2 ways to do this:

# Method 2 (export2.js)

## Usage
1. Install "Chrome Apps & Extensions Developer Tool"
2. Login with your credentials to the PasswordBox extension
3. Right click anywhere in the PasswordBox popup and click "Inspect Element"
4. In the "Developer Tools" window that opens select the "Console" tab
6. Paste the entire contents of "export2.js" into it + press enter
8. Wait until all the passwords are processed. Don't navigate to a different page or you'll have to start over.
9. Use the data anyway you want!


# Method 1 (export.js)
# DEPRECATED DON'T USE!

## Usage
1. Install "Chrome Apps & Extensions Developer Tool"
2. Login with your credentials to the PasswordBox extension
3. Open "Chrome Apps & Extensions Developer Tool"
4. Select the "Extensions" tab
5. Scroll down to the "PasswordBox" extension entry and click the "background page" link next to "inspect views:"
6. In the "Developer Tools" window that opens, paste the entire contents of "export.js" into it + press enter
7. Run one of the export functions to get the database as CSV to your clipboard
8. Use the data anyway you want!

### MK.exportCsvToClipboard([options])

Export all the fields as a CSV to the clipboard.

The export can be configured with a config object. It has support for the following propeties:
  - cols; an array with the names of the fields, in the order wanted. Supported fields are; name, url, login,
  - password, created_at, detail, domain, memo, type, updated_at, virtual_password, id, member_id.
  - includeHeader; a bool that contols rendering of column headers.

### MK.exportFor1PasswordToClipboard()

Basically the same as exportCsvToClipboard, but configured to work out of the box with the CSV import option for 1Password.
