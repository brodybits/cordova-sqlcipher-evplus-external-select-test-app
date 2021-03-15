var database = null;

function initDatabase() {
  var permissions = cordova.plugins.permissions

  permissions.requestPermission(
    permissions.WRITE_EXTERNAL_STORAGE,
    step2,
    function(e) {
      showMessage('permissions error: ' + e.message)
    }
  )
}

function step2() {
  var externalDirectory = cordova.file.externalRootDirectory

  window.resolveLocalFileSystemURL(externalDirectory, step3, function(e) {
    showMessage('file error: ' + e.message)
  })
}

function step3(externalDirectoryEntry) {
  // showMessage('resolved external directory URL: ' + externalDirectoryEntry.toURL())

  var url =  externalDirectoryEntry.toURL()

  // showMessage('db location url: ' + url)

  // database = window.sqlitePlugin.openDatabase({name: 'plain.db', androidDatabaseLocation: url},
  database = window.sqlitePlugin.openDatabase({
    name: 'base.sqlitedb',
    key: 'testKey',
    androidDatabaseLocation: url
  }, function() {
    showMessage('open db OK with location url: ' + url)
  }, function(e) {
    showMessage('open error: ' + e.message)
  })

  // showMessage('started to open the database')
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
