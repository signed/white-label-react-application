import { useContext } from 'react';
import * as React from 'react';

export interface ExtensionRegistry {
    extensionsFor<T>(point: ExtensionPoint<T>): Extension<T>[];
}

export const ExtensionPointTypes = ['BottomBarItem'] as const;
export type ExtensionPointType = typeof ExtensionPointTypes[number];

export interface ExtensionPoint<T> {
    type: ExtensionPointType

    implementWith(value: T): Extension<T>;
}

export interface Extension<T> {
    extensionPointType: ExtensionPointType;
    context: T;
}

export class BasicExtensionPoint<T> implements ExtensionPoint<T> {
    static ofType<S>(type: ExtensionPointType): ExtensionPoint<S> {
        return new BasicExtensionPoint<S>(type);
    }

    constructor(public type: ExtensionPointType) {
    }


    implementWith(context: T): Extension<T> {
        return {
            extensionPointType: this.type,
            context
        };
    }
}

export class DefaultExtensionRegistry implements ExtensionRegistry {
    private readonly extensions = new Map<ExtensionPointType, Extension<any> []>();

    register<T>(extension: Extension<T>) {
        let mayBe = this.extensions.get(extension.extensionPointType);
        if (mayBe === undefined) {
            mayBe = [];
            this.extensions.set(extension.extensionPointType, mayBe);
        }
        mayBe.push(extension);
    }

    extensionsFor<T>(point: ExtensionPoint<T>): Extension<T>[] {
        return this.extensions.get(point.type) ?? [];
    }
}

export const ExtensionRegistry = React.createContext<ExtensionRegistry | undefined>(undefined);

export const useExtensionRegistry = (): ExtensionRegistry => {
    const mayBeExtensionRegistry = useContext(ExtensionRegistry);
    if (mayBeExtensionRegistry === undefined) {
        throw new Error('No extension registry found in the parent context');
    }
    return mayBeExtensionRegistry;
}
