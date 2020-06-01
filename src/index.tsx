import { Box, BoxProps, CSSReset, Flex, Link, ThemeProvider } from '@chakra-ui/core';
import * as React from 'react';
import { useContext } from 'react';
import { render } from 'react-dom';
import './index.css';

interface StaticConfiguration {
    applicationName: string;
}

interface DynamicConfiguration {

}

const TopBar: React.FC<BoxProps> = (props) => {
    const { applicationName } = useContext(StaticConfiguration);
    return <Box {...props} as={'header'}>
        <span>Welcome to {applicationName}</span>
    </Box>;
};

const MainView: React.FC<BoxProps> = (props) => {
    return <Box {...props}>
        Look at me two
    </Box>;
};

const Legal = () => {
    return <Link>Legal</Link>;
};

const Contact = () => {
    return <Link>Send us a mail</Link>
}
const TermsOfUse = () => {
    return <Link>Terms of Use</Link>
}
const PrivacyPolicy = () => {
    return <Link>Privacy Policy</Link>
}

class BasicExtensionPoint implements ExtensionPoint {
    static ofType(type: ExtensionPointType): ExtensionPoint {
        return new BasicExtensionPoint(type)
    }
    constructor(public type:ExtensionPointType) {
    }


    implementWith(element: () => JSX.Element): Extension {
        return {
            extensionPointType: this.type,
            element
        }
    }
}

const bottomBarExtension = BasicExtensionPoint.ofType('BottomBarItem')

const BottomBar: React.FC<BoxProps> = (props) => {
    const registry = useContext(ExtensionRegistry);
    return <Box {...props} as={'footer'}>
        <Flex justifyContent={'space-around'}>
            {registry.extensionsFor(bottomBarExtension).map(extension => <extension.element/>)}
            <Legal/>
        </Flex>
    </Box>;
};

const ExtensionPointTypes = ['BottomBarItem'] as const;
type ExtensionPointType = typeof ExtensionPointTypes[number];

interface ExtensionPoint {
    type: ExtensionPointType

    implementWith(element: () => JSX.Element): Extension;
}

interface Extension {
    extensionPointType: ExtensionPointType;
    element: () => JSX.Element;
}

interface ExtensionRegistry {
    extensionsFor(point: ExtensionPoint): Extension[];
}

class DefaultExtensionRegistry implements ExtensionRegistry {
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

const config: StaticConfiguration = {
    applicationName: 'Modulus'
};

const StaticConfiguration = React.createContext(config);
const registry = new DefaultExtensionRegistry();
const ExtensionRegistry = React.createContext<ExtensionRegistry>(registry);

registry.register(bottomBarExtension.implementWith(TermsOfUse));
registry.register(bottomBarExtension.implementWith(PrivacyPolicy));
registry.register(bottomBarExtension.implementWith(Contact));

const rootElement = document.getElementById('root');
render(
    <StaticConfiguration.Provider value={config}>
        <ExtensionRegistry.Provider value={registry}>
            <ThemeProvider>
                <CSSReset/>
                <Flex flexDirection={'column'} height={'100%'} border={'1px'}>
                    <TopBar flexGrow={0} borderBottom={'1px'}/>
                    <MainView flexGrow={1}/>
                    <BottomBar flexGrow={0} borderTop={'1px'}/>
                </Flex>
            </ThemeProvider>
        </ExtensionRegistry.Provider>
    </StaticConfiguration.Provider>,
    rootElement
);
