/**
 * http://usejsdoc.org/
 */
function display(data){
	   // console.log(data[0]);
	var str ='';
	var text='';
	var output ='';
	for(var i =0;i<data.length; i++){  
		var len = data[i].traces.length;
		var len2 = data[i].traces[len-1].length;
		str +='<div class="container">';
		str +='<div class="col-md-8">';
		str += ' <div class="panel panel-default">';
		str += '<div class="panel-heading">';
		str += '<h3 class="panel-title" id="head">'+data[i].rule+' on line ';
		str += data[i].traces[len-1][len2-1].line +'</h3>';
		str +='<span class="pull-right clickable"><i class="glyphicon glyphicon-chevron-up"></i></span></div>';
		str += '<div class="panel-body >';
            
        for(var j=0;j<data[i].traces.length;j++)
        {
            for(var l = 0; l<data[i].traces[j].length;l++)
            {
                text = '<br><strong style="color:#003399">'+ data[i].traces[j][l].ASTNodeType +'</strong><em style="color:#009999"> '+ data[i].traces[j][l].ASTNodeName + " </em> ( <i>" + data[i].traces[j][l].filename;
                text+= ' </i> &nbsp &#8227 Line: ' +data[i].traces[j][l].line+" Col: "+data[i].traces[j][l].col + " )"+'<br>';

                 for(var k =0;k<data[i].traces[j][l].params.length;k++)
                 {
                    var paramName = data[i].traces[j][l].params[k].paramName;
                    var paramType = data[i].traces[j][l].params[k].paramType;
                    if(paramName == null)
                    {
                        text += " ";
                     }
                    else if(paramName != null && paramType == null){
                        text += " Parameters: "+"<var>"+data[i].traces[j][l].params[k].paramName+"</var> ";
               
                    }
                    else 
                    {
                        text += " Parameters: "+"<var>"+data[i].traces[j][l].params[k].paramName+"</var> ( Type: "+data[i].traces[j][l].params[k].paramType+" )";
                    }
                 }
            
                 output+=text;
            
                 if(data[i].traces[j][l].codeSnippet.length === 0){
                    output +="";                
                 }
                 else{
                	 var textbox = '<br><code>'+"\n"+data[i].traces[j][l].codeSnippet+'</code>';

                	 output +=textbox;
                 }
            
                 if(l != (data[i].traces[j].length -1)){
                     output += '<span><center><font size="5"> &#x2193;</font></center></span>';
                 }
            }
        }
        str += output;
        str +='</div></div></div></div>'
        $('#total').html(str);
        output='';
    }
}