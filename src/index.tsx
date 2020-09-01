import React, { useState } from "react";
import { StyleSheet, View, Image, ViewProps, ImageProps } from "react-native";
import FastImage, { FastImageProps } from "react-native-fast-image";

export interface FastImagePlusProps extends Omit<FastImageProps, "style"> {
    style?: ViewProps["style"];
    loadingImg?: ImageProps["source"];
    errImg?: ImageProps["source"];
    placeholderImg?: ImageProps["source"];
}

function interceptCallback<T extends (...args: any[]) => any>(
    handler: T,
    callback?: T
) {
    return (...args) => {
        handler(...args);
        return callback?.apply(null, args);
    };
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

export default FastImagePlus;
