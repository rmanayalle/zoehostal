
function capitalize(string)
{
    return string.toLowerCase().replace( /\b./g, function(a){ return a.toUpperCase(); } );
}


export {
  capitalize
}
