import React, { useState, useCallback } from "react";
import { StyleSheet, View, Image, ImageRequireSource } from "react-native";
import FastImage, { FastImageProps } from "react-native-fast-image";

export interface FastImagePlusProps extends FastImageProps {
    loadingImg?: ImageRequireSource; // enforce local image
    errImg?: ImageRequireSource; // enforce local image
    placeholderImg?: ImageRequireSource; // enforce local image
}

function interceptCallback<T extends (...args: any[]) => any>(
    handler: T,
    callback?: T
) {
    return useCallback(
        (...args) => {
            handler(...args);
            return callback?.apply(null, args);
        },
        [callback]
    );
}

let defaultProps: Partial<FastImagePlusProps> = {};

const FastImagePlus = (props: FastImagePlusProps) => {
    const {
        source,
        style,
        placeholderImg,
        loadingImg,
        errImg,
        ...passProps
    } = {
        ...defaultProps,
        ...props,
    };
    const isLocalImage = Number.isInteger(source);
    const [isLoading, setLoading] = useState(!isLocalImage);
    const [isError, setError] = useState(false);

    return (
        <View style={style}>
            {(isError || isLoading) && placeholderImg && (
                <Image
                    style={StyleSheet.absoluteFill}
                    source={placeholderImg}
                    resizeMode={"cover"}
                />
            )}
            {isError && errImg && (
                <Image
                    style={StyleSheet.absoluteFill}
                    source={errImg}
                    resizeMode={"cover"}
                />
            )}
            {isLoading && loadingImg && (
                <Image
                    style={StyleSheet.absoluteFill}
                    source={loadingImg}
                    resizeMode={"cover"}
                />
            )}
            <FastImage
                {...passProps}
                style={StyleSheet.absoluteFill}
                source={source}
                onLoadStart={interceptCallback(() => {
                    setLoading(true);
                    setError(false);
                }, props.onLoadStart)}
                onLoad={interceptCallback(() => {
                    setLoading(false);
                    setError(false);
                }, props.onLoad)}
                onError={interceptCallback(() => {
                    setLoading(false);
                    setError(true);
                }, props.onError)}
            />
        </View>
    );
};

FastImagePlus.setDefaultProps = (props: Partial<FastImagePlusProps>) => {
    defaultProps = {
        ...defaultProps,
        ...props,
    };
};

export default React.memo(FastImagePlus);

const t = React.memo(FastImagePlus);
