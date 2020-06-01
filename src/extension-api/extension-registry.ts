import { useContext } from 'react';
import * as React from 'react';

export interface ExtensionRegistry {
    extensionsFor<T extends Object>(point: ExtensionPoint<T>): (Extension & T) [];
}

// todo find a way to dynamically collect those and generate the type
export const ExtensionPointTypes = ['BottomBarItem', 'MainViewContent'] as const;
export type ExtensionPointType = typeof ExtensionPointTypes[number];

export interface ExtensionPoint<T> {
    type: ExtensionPointType

    implementWith(value: T): Extension & T;
}

export interface Extension {
    extensionPointType: ExtensionPointType;
}

export class BasicExtensionPoint<T extends object> implements ExtensionPoint<T> {
    static ofType<S extends Object>(type: ExtensionPointType): ExtensionPoint<S> {
        return new BasicExtensionPoint<S>(type);
    }

    constructor(public type: ExtensionPointType) {
    }

    implementWith(context: T): Extension & T {
        return {
            extensionPointType: this.type,
            ...context
        };
    }
}

export class DefaultExtensionRegistry implements ExtensionRegistry {
    private readonly extensions = new Map<ExtensionPointType, (Extension) []>();

    register<T>(extension: Extension & T) {
        let mayBe = this.extensions.get(extension.extensionPointType);
        if (mayBe === undefined) {
            mayBe = [];
            this.extensions.set(extension.extensionPointType, mayBe);
        }
        mayBe.push(extension);
    }

    extensionsFor<T extends object>(point: ExtensionPoint<T>): (Extension & T)[] {
        const mayBe = this.extensions.get(point.type) ?? [];
        return [...mayBe as ((Extension & T) [])];
    }
}

export const ExtensionRegistry = React.createContext<ExtensionRegistry | undefined>(undefined);

export const useExtensionRegistry = (): ExtensionRegistry => {
    const mayBeExtensionRegistry = useContext(ExtensionRegistry);
    if (mayBeExtensionRegistry === undefined) {
        throw new Error('No extension registry found in the parent context');
    }
    return mayBeExtensionRegistry;
};
