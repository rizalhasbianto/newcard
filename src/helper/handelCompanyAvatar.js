function stringToColor(string) {
    let hash = 0;
    let i;
  
    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
  
    let color = '#';
  
    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */
  
    return color;
  }
  
  export function stringAvatar(name) {
    
    const splitName = name.split(' ')
    let inisial
    if(splitName.length > 1) {
      inisial = {
        sx: {
          bgcolor: stringToColor(name),
          width:"80px",
          height:"80px",
          fontSize: "28px"
        },
        children: `${splitName[0][0]}${splitName[1][0]}`,
      }
    } else {
      const splitOneName = name.split("")
      inisial = {
        sx: {
          bgcolor: stringToColor(name),
          width:"80px",
          height:"80px",
          fontSize: "28px"
        },
        children: `${splitOneName[0][0]}${splitOneName[1][0]}`,
      }
    }
    return inisial;
  }