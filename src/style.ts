export type ScreenSizeType = "sm" | "md" | "lg" 

export function GetScreenSizeType() : ScreenSizeType{
   const width = window.innerWidth

    if (width < 640) 
      return ("sm")
    else if (width < 1024) 
      return ("md")
    else 
      return ("lg")
}


const styles = {
  paddingX: "sm:px-10 px-4",
  paddingY: "sm:py-10 py-4",
  padding: "sm:px-10 px-4 sm:py-10 py-6",

  heroHeadText:
    "font-semibold text-white lg:text-[48px] sm:text-[40px] xs:text-[32px] text-[28px] leading-tight mt-1",
  heroSubText:
    "text-white/70 font-normal lg:text-[18px] sm:text-[16px] text-[14px] leading-snug",
  sectionHeadText:
    "text-white font-semibold md:text-[36px] sm:text-[30px] text-[24px] leading-tight",
  sectionSubText:
    "text-[13px] text-white/50 tracking-wide",
  subDescriptionText: 
    "text-[13px] text-white/60 leading-relaxed",
  terminalTextSizeStyle: 
    "md:text-[16px] sm:text-[14px] text-[12px]",
  aboutDescriptionTextSizeStyle: 
    "md:text-[16px] sm:text-[14px] text-[12px]",
  projectHeadTextSizeStyle: 
    "md:text-[24px] sm:text-[20px] text-[18px] leading-tight",
  projectDescriptionTextStyle: 
    "md:text-[16px] sm:text-[14px] text-[12px] leading-tight",
  projectBulletPointsTextStyle:
    "md:text-[16px] sm:text-[12px] text-[10px] leading-tight",
  getProjectTagTextSizeStyle : (textSizeModifier : number = 0) => `
    md:text-[${Math.max(16 + textSizeModifier, 12)}px] sm:text-[${Math.max(14 + textSizeModifier, 10)}px] text-[${Math.max(12 + textSizeModifier, 8)}px] leading-tight`,
  
  techStackCategoryTextStyle:
    "md:text-[18px] sm:text-[16px] text-[14px] leading-tight",
  techStackMatchStyle : {
    titleTextSizeStyle : "md:text-[22px] sm:text-[19px] text-[16px] leading-tight",
    subTitleTextSizeStyle : "md:text-[18px] sm:text-[16px] text-[14px] leading-tight",
    buttonSizeStyle : "md:h-[50px] sm:text-[40px] h-[35px] w-[calc(5%+75px)]",
    buttonTextSizeStyle : "md:text-[22px] sm:text-[18px] text-[16px] leading-tight",
  },
  techStackElementStyles:
    {
      boxWidthStyle: "md:w-[90px] w-[70px]",
      imageSizeStyle: "md:w-12 md:h-12 w-10 h-10",
      nameSizeSyle : "md:text-[14px]  text-[11px]",
    },
  experienceCardStyles : {
    titleTextSizeStyle : "md:text-[20px] text-[16px]",
    subTitleSizeStyle : "md:text-[16px] text-[13px]",
    bulletPointsSizeStyle : "md:text-[12px] text-[10px]",
  },
  getLinkDisplayPixelSize : (screenSize : ScreenSizeType) => {
    if (screenSize == "lg") 
      return 50
    else if (screenSize == "md")
      return 45
    else if (screenSize == "sm")
      return 40
  },
  copyEmailSizeStyle : 
    "md:text-[16px] sm:text-[14px] text-[12px]",
};

export { styles };