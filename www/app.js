var database = null;

var nextUser = 101;

function initDatabase() {

// showMessage('start init')

var permissions = cordova.plugins.permissions

var externalDirectory = cordova.file.externalRootDirectory

permissions.requestPermission(permissions.WRITE_EXTERNAL_STORAGE,
function() {
window.resolveLocalFileSystemURL(externalDirectory, function(externalDirectoryEntry) {
	// showMessage('resolved external directory URL: ' + externalDirectoryEntry.toURL())

  // database = window.sqlitePlugin.openDatabase({name: 'plain.db', androidDatabaseLocation: externalDataDirectoryEntry.toURL()});

  var url =  externalDirectoryEntry.toURL()

  // showMessage('db location url: ' + url)

  // database = window.sqlitePlugin.openDatabase({name: 'plain.db', androidDatabaseLocation: url},
  database = window.sqlitePlugin.openDatabase({name: 'base.sqlitedb', key: 'testKey', androidDatabaseLocation: url},
	  function() { showMessage('db open ok from location url: ' + url)},
	  function(e) { showMessage('open error: ' + e.message) }
  )

	// showMessage('started to open the database')

}, function(e) { showMessage('file error: ' + e.message) } )

}, function(e) { showMessage('permissions error: ' + e.message) })

}

function selectTest() {
  database.transaction(function(transaction) {
    transaction.executeSql('SELECT testString FROM testTable', [], function(ignored, resultSet) {
      showMessage('testString: ' + resultSet.rows.item(0).testString);
    });
  }, function(error) {
    showMessage('SELECT count error: ' + error.message);
  });
}

function showMessage(message) {
  console.log(message);
  if (window.cordova.platformId === 'osx') window.alert(message);
  else navigator.notification.alert(message);
}

document.addEventListener('deviceready', function() {
  $('#select-test').click(selectTest);

  initDatabase();
});
