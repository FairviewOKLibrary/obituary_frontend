'use client';
import styles from '@/styles/BackToTop.module.scss';
import arrowup from '@/assets/arrow_up.svg';
import Image from 'next/image';

const BackToTop = () => {

    const toTop = () => window.scrollTo(0, 0);
    return (
        <div
        className={styles.backtotop}
        onClick={toTop}>
            <Image src={arrowup} alt=''/>
        </div>
    )
}

export default BackToTop;