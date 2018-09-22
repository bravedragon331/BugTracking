"use strict";
AUI().ready('aui-ace-editor', function(A) {
    var editor = new A.AceEditor({
        boundingBox: '#editor',

        // highlightActiveLine: false,
        readOnly: true,
        // tabSize: 8,
        // useSoftTabs: true,
        // useWrapMode: true,
        // showPrintMargin: false,
        mode: 'php',
        value: '<div></div>'
    }).render();

    // editor.getEditor().setTheme('ace/theme/cobalt');

    //editor.set('mode', 'javascript');
    // editor.set('mode', 'json');
    // editor.set('mode', 'xml');

    var mode = A.one('#mode');
    if (mode) {

        var currentMode = 'javascript';





        mode.on('change', function(event) {
            currentMode = this.val();

            editor.set('mode', currentMode);


        });
    }

    // editor.set('value', 'Change the original content');
});
