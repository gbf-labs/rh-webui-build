const NONE = "rgba(255, 255, 255, 0)";
const WHITE = "rgba(255,255,255, 1)";
const BLACK = "rgba(0,0,0,1)";

//###FOLLOWING THE COLOR WHEEL ###
//main colors
const RED = "rgba(255,0,0,1)";
const GREEN = "rgba(0,255,0,1)";
const BLUE = "rgba(0,0,255,1)";

//secondary colors
const REDGREEN = "rgba(255,255,0,1)";
const GREENBLUE = "rgba(0,255,255,1)";
const BLUERED = "rgba(255,0,255,1)";

//tirthiary colors
const REDYELLOW = "rgba(255,127,0,1)"; //+red
const GREENYELLOW = "rgba(255,255,0,1)"; //-green
const GREENCYAN = "rgba(0,255,127,1)"; //+green
const BLUECYAN = "rgba(0,127,255,1)"; //-blue
const BLUEMAGENTA = "rgba(127,0,255,1)"; //+blue
const REDMAGENTA = "rgba(255,0,127,1)"; //-red
//### END COLORWHEEL ###

//aliases
const YELLOW = REDGREEN;
const CYAN = GREENBLUE;
const MAGENTA = BLUERED;
const ORANGE = REDYELLOW;
const PINK = REDMAGENTA;
const PURLE = BLUEMAGENTA;

//other colors
const BORDEAUX = "rgba(95,2,31,1)";

//specials
const INTELLIAN_ACU_DISP = "rgba(0,200,255,1)";
const SAILOR_VHF62xx_DISP_BG = "rgba(10,10,10,1)";
const SAILOR_VHF62xx_DISP_FG = "rgba(240,240,240,1)";
const RARITAN_7SEGDISP_BG = "rgba(104,11,30,1)";
const RARITAN_7SEGDISP_SEGOFF = "rgba(130,8,31,1)";
const RARITAN_7SEGDISP_SEGON = "rgba(250,30,31,1)";

//others
const GREY = "rgba(192,192,192,1)";
const OFF = "rgba(224,224,224,1)";

export default {
  NONE,
  WHITE,
  BLACK,

  RED,
  GREEN,
  BLUE,

  REDGREEN,
  GREENBLUE,
  BLUERED,

  REDYELLOW, //+red
  GREENYELLOW, //-green
  GREENCYAN, //+green
  BLUECYAN, //-blue
  BLUEMAGENTA, //+blue
  REDMAGENTA, //-red

  YELLOW,
  CYAN,
  MAGENTA,
  ORANGE,
  PINK,
  PURLE,

  BORDEAUX,

  INTELLIAN_ACU_DISP,
  SAILOR_VHF62xx_DISP_BG,
  SAILOR_VHF62xx_DISP_FG,
  RARITAN_7SEGDISP_BG,
  RARITAN_7SEGDISP_SEGOFF,
  RARITAN_7SEGDISP_SEGON,

  GREY,
  OFF
};
