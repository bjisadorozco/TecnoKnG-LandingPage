// Assets de TecnoKnG - Identidad de marca
import logoTk from '../assets/logo-tk.png'
import ecommerceTk from '../assets/ecommerce-tk.png'
import robotTk from '../assets/robot-tk.png'
import asistenteVirtual from '../assets/asistente-virtual.png'
import tecnicoRobot from '../assets/tecnico-robot.png'

export const brandAssets = {
  logos: {
    main: logoTk,
    ecommerce: ecommerceTk,
  },
  mascot: {
    robot: robotTk,
  },
  assistant: {
    virtual: asistenteVirtual,
  },
  technician: {
    robot: tecnicoRobot,
  },
}

// Helper para obtener el logo según la página
export const getLogoByPage = (isStorePage: boolean) => {
  return isStorePage ? brandAssets.logos.ecommerce : brandAssets.logos.main
}
