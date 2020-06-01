import { Box, BoxProps, CSSReset, Flex, Link, ThemeProvider } from '@chakra-ui/core';
import * as React from 'react';
import { useContext } from 'react';
import { render } from 'react-dom';
import { BasicExtensionPoint, DefaultExtensionRegistry, ExtensionRegistry, useExtensionRegistry } from './extension-api/extension-registry';
import './index.css';

interface StaticConfiguration {
    applicationName: string;
}

type SupportedLanguage = 'EN' | 'DE';

interface DynamicConfiguration {
    language: SupportedLanguage;
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
    return <Link>Send us a mail</Link>;
};
const TermsOfUse = () => {
    return <Link>Terms of Use</Link>;
};
const PrivacyPolicy = () => {
    return <Link>Privacy Policy</Link>;
};


type BottomBarExtensionContext = { element: () => JSX.Element }

const bottomBarExtension = BasicExtensionPoint.ofType<BottomBarExtensionContext>('BottomBarItem');

const BottomBar: React.FC<BoxProps> = (props) => {
    const registry = useExtensionRegistry();
    return <Box {...props} as={'footer'}>
        <Flex justifyContent={'space-around'}>
            {registry.extensionsFor(bottomBarExtension)
                .map(extension => {
                    return <extension.context.element/>;
                })}
            <Legal/>
        </Flex>
    </Box>;
};


const config: StaticConfiguration = {
    applicationName: 'Modulus'
};

const registry = new DefaultExtensionRegistry();
registry.register(bottomBarExtension.implementWith({ element: TermsOfUse }));
registry.register(bottomBarExtension.implementWith({ element: PrivacyPolicy }));
registry.register(bottomBarExtension.implementWith({ element: Contact }));
const StaticConfiguration = React.createContext(config);

const createBrandedExperience = (registry: ExtensionRegistry) => {

    return (config: DynamicConfiguration) => {
        return <ExtensionRegistry.Provider value={registry}>
            <ThemeProvider>
                <CSSReset/>
                <Flex flexDirection={'column'} height={'100%'} border={'1px'}>
                    <TopBar flexGrow={0} borderBottom={'1px'}/>
                    <MainView flexGrow={1}/>
                    <BottomBar flexGrow={0} borderTop={'1px'}/>
                </Flex>
            </ThemeProvider>
        </ExtensionRegistry.Provider>;
    };
};

const BrandedComponent = createBrandedExperience(registry);

const rootElement = document.getElementById('root');
const dynamicConfiguration: DynamicConfiguration = { language: 'EN' };
render(
    <StaticConfiguration.Provider value={config}>
        <BrandedComponent {...dynamicConfiguration}/>
    </StaticConfiguration.Provider>,
    rootElement
);
