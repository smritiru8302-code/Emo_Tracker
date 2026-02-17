import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { COLORS, FONT_SIZES, SPACING } from '../styles/theme';

const ProgressRing = ({ progress = 75, size = 120, strokeWidth = 10, color, label }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (progress / 100) * circumference;
    const ringColor = color || COLORS.primary;

    return (
        <View style={styles.container}>
            <Svg width={size} height={size} style={styles.svg}>
                {/* Background circle */}
                <Circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={ringColor + '20'}
                    strokeWidth={strokeWidth}
                    fill="transparent"
                />
                {/* Progress circle */}
                <Circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={ringColor}
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    rotation="-90"
                    origin={`${size / 2}, ${size / 2}`}
                />
            </Svg>
            <View style={[styles.centerContent, { width: size, height: size }]}>
                <Text style={[styles.value, { color: ringColor }]}>{progress}%</Text>
                {label && <Text style={styles.label}>{label}</Text>}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    svg: {
        transform: [{ rotate: '0deg' }],
    },
    centerContent: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
    },
    value: {
        fontSize: FONT_SIZES.xxl,
        fontWeight: '800',
    },
    label: {
        fontSize: FONT_SIZES.xs,
        color: COLORS.textSecondary,
        marginTop: SPACING.xs,
        fontWeight: '500',
    },
});

export default ProgressRing;
