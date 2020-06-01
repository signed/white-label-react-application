import { useContext } from 'react';
import * as React from 'react';

export interface ExtensionRegistry {
    extensionsFor(point: ExtensionPoint): Extension[];
}

export const ExtensionPointTypes = ['BottomBarItem'] as const;
export type ExtensionPointType = typeof ExtensionPointTypes[number];

export interface ExtensionPoint {
    type: ExtensionPointType

    implementWith(element: () => JSX.Element): Extension;
}

export interface Extension {
    extensionPointType: ExtensionPointType;
    element: () => JSX.Element;
}

export class BasicExtensionPoint implements ExtensionPoint {
    static ofType(type: ExtensionPointType): ExtensionPoint {
        return new BasicExtensionPoint(type);
    }

    constructor(public type: ExtensionPointType) {
    }


    implementWith(element: () => JSX.Element): Extension {
        return {
            extensionPointType: this.type,
            element
        };
    }
}

export class DefaultExtensionRegistry implements ExtensionRegistry {
    private readonly extensions = new Map<ExtensionPointType, Extension []>();

    register(extension: Extension) {
        let mayBe = this.extensions.get(extension.extensionPointType);
        if (mayBe === undefined) {
            mayBe = [];
            this.extensions.set(extension.extensionPointType, mayBe);
        }
        mayBe.push(extension);
    }

    extensionsFor(point: ExtensionPoint): Extension[] {
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
