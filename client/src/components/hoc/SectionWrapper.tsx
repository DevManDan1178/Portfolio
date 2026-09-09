import { motion } from 'framer-motion';
import { styles } from '../../style';
import { staggerContainer } from '../../utils/motion';
import type { ReactElement } from 'react';

const SectionWrapper = (Component : () => ReactElement, idName : string, paddingEnabled = true) => function HOC() {
    return (
        <motion.section
            variants={staggerContainer()}
            initial="hidden"
            whileInView="show"
            viewport={{once: true, amount: 0.25}}
            className={`${paddingEnabled && styles.padding} max-w-7xl mx-auto relative z-0 justify-start`}
        >
            <span className={`block ${paddingEnabled && styles.sectionIdMarginY}`} id={idName}>
                &nbsp;
            </span>
            <Component/>
        </motion.section>
    )
}

export default SectionWrapper