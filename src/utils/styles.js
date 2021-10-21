import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
    /* __next is actually #__next, its an id */
    __next: {width:'100vw', marginTop:0},
    navBar: {
        backgroundColor: '#203040',
        position: 'relative',
        top:0,
        marginLeft:0,
        marginRight:0,
        width:'100%',
        '& a': {
            color: '#ffff!important',
            marginLeft: 10
        }
    },
    brand: {fontWeight: 'bold', fontSize: '1.5rem'},
    grow: {flexGrow:1},
    main: {
        minHeight: '80vh'
    },
    shaddow0: {boxShadow: "none"},
    footer: {
        textAlign: 'center',
        marginTop: 10,
    },
    section: {
        marginTop: 10,
        marginBottom: 10
    },
    form: {
        maxWidth: 400, margin: '0 auto',
    },
    centered: {marginLeft: "auto", marginRight: "auto"},
    center: {textAlign: "center"},
    w200s: {width: 200},
    w150s: {width: 150},

    h150: {height: 150},
    mb3: {marginBottom: 30},
    mt1: {maginTop: 10,},
    mt2: {maginTop: 20,},
    mt3: {maginTop: 30,},
    mt4: {maginTop: 40,},
    mt5: {maginTop: 50,},

    p25: {padding: 25},
    pt1: {paddingTop: 10,},
    pt2: {paddingTop: 20,},
    pt3: {paddingTop: 30,},
    pt4: {paddingTop: 40,},
    pt5: {paddingTop: 50,},

    pl1: {paddingLeft: "10px"},
    pl2: {paddingLeft: "20px"},
    pl3: {paddingLeft: "30px"},
    pl4: {paddingLeft: "40px"},
    pl5: {paddingLeft: "50px"},
    
    p2: {padding: 20},
    p1: {padding: 10},
    p3: {padding: 30},
    p4: {padding: 40},

    br5: {borderRadius: 5, border: '1px solid gainsboro'},
    border: {borderRadius: 10, border: '1px solid gainsboro'},

    w30: {width: "30%"},
    w40: {width: "40%"},
    w50: {width: "50%"},
    w60: {width: "60%"},
    w70: {width: "70%"},
    w100: {width: "100%"},

    show: {visibility: "visible", display: "block"},
    hide: {visibility: "hidden", display: "none"},
    block: {display: "block"},
    none: {display: "none"},

    navbarButton: {color:"#ffff", textTransform:"initial"},
    transparentBackGround: {backgroundColor: "transparent"},
    hAuto: {marginBottom:"auto", height: "100%"},
    toggle: {
        color:'gainsboro',
        
       '& .Mui-checked': {
          color: '#109125',
          transform:'translateX(25px) !important'
      },
      '& .MuiSwitch-track': {
          backgroundColor:'aliceblue'
      },
    },
    plr4: {
        paddingLeft: "15px", paddingRight: "15px",
    },
    plr1: {
        paddingLeft: "15px", paddingRight: "10px",
    },
    error: {color: '#f04040'},
})

export default useStyles;

