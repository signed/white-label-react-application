import { Box, BoxProps, CSSReset, Flex, Link, ThemeProvider, Image, Text } from '@chakra-ui/core';
import * as React from 'react';
import { useContext } from 'react';
import { render } from 'react-dom';
import { BasicExtensionPoint, DefaultExtensionRegistry, ExtensionRegistry, useExtensionRegistry } from './extension-api/extension-registry';
import './index.css';

export interface StaticConfiguration {
    applicationName: string;
}

export const StaticConfiguration = React.createContext<StaticConfiguration | undefined>(undefined);

export const useStaticConfiguration = (): StaticConfiguration => {
    const mayBe = useContext(StaticConfiguration);
    if (mayBe === undefined) {
        throw new Error('Add a StaticConfiguration.Provider to the parent of the calling component');
    }
    return mayBe;
};

type SupportedLanguage = 'EN' | 'DE';

interface DynamicConfiguration {
    language: SupportedLanguage;
}

const TopBar: React.FC<BoxProps> = (props) => {
    const { applicationName } = useStaticConfiguration();
    return <Box {...props} as={'header'}>
        <span>Welcome to {applicationName}</span>
    </Box>;
};

const MainView: React.FC<BoxProps> = (props) => {
    const extensions = useExtensionRegistry().extensionsFor(mainViewContentExtension);
    if (extensions.length > 1) {
        throw new Error('only one mainViewContentExtension allowed');
    }
    const extension = extensions[0] ?? {
        alt: 'nothing here',
        caption: 'Messier 87',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/4f/Black_hole_-_Messier_87_crop_max_res.jpg'
    };
    return <Box as={'main'} {...props}>
        <Flex direction={'column'} alignItems={'center'}>
            <Image flexGrow={0} src={extension.imageUrl} height={'80vh'}/>
            <Text>{extension.caption}</Text>
        </Flex>
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

type MainViewContentContext = {
    imageUrl: string,
    caption: string,
    alt: string
}
const mainViewContentExtension = BasicExtensionPoint.ofType<MainViewContentContext>('MainViewContent');

const BottomBar: React.FC<BoxProps> = (props) => {
    const registry = useExtensionRegistry();
    return <Box {...props} as={'footer'}>
        <Flex justifyContent={'space-around'}>
            {registry.extensionsFor(bottomBarExtension)
                .map(extension => {
                    return <extension.element/>;
                })}
            <Legal/>
        </Flex>
    </Box>;
};

const createBrandedExperience = (registry: ExtensionRegistry) => {
    return (_config: DynamicConfiguration) => {
        return <ExtensionRegistry.Provider value={registry}>
            <ThemeProvider>
                <CSSReset/>
                <Flex flexDirection={'column'} height={'100%'} border={'1px'} flexGrow={1}>
                    <TopBar flexGrow={0} borderBottom={'1px'}/>
                    <MainView flexGrow={1}/>
                    <BottomBar flexGrow={0} borderTop={'1px'}/>
                </Flex>
            </ThemeProvider>
        </ExtensionRegistry.Provider>;
    };
};


const nut = () => {
    const config: StaticConfiguration = {
        applicationName: 'Nut'
    };
    const registry = new DefaultExtensionRegistry();
    registry.register(bottomBarExtension.implementWith({ element: TermsOfUse }));
    registry.register(bottomBarExtension.implementWith({ element: PrivacyPolicy }));
    registry.register(bottomBarExtension.implementWith({ element: Contact }));
    registry.register(mainViewContentExtension.implementWith({
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/df/Nut.svg',
        caption: 'Nut - Egyptian goddess of the Sky',
        alt: 'Nut'
    }));
    const BrandedComponent = createBrandedExperience(registry);
    const dynamicConfiguration: DynamicConfiguration = { language: 'EN' };
    return <StaticConfiguration.Provider value={config}>
        <BrandedComponent {...dynamicConfiguration}/>
    </StaticConfiguration.Provider>;
};

const geb = () => {
    const config: StaticConfiguration = {
        applicationName: 'Geb'
    };

    const GebShows = () => {
        return <Link>Geb Shows</Link>;
    };

    const registry = new DefaultExtensionRegistry();
    registry.register(bottomBarExtension.implementWith({ element: GebShows }));
    registry.register(bottomBarExtension.implementWith({ element: Contact }));
    registry.register(mainViewContentExtension.implementWith({
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/53/Geb.svg',
        caption: 'Geb - Egyptian god of the Earth',
        alt: 'Geb'
    }));
    const BrandedComponent = createBrandedExperience(registry);
    const dynamicConfiguration: DynamicConfiguration = { language: 'EN' };
    return <StaticConfiguration.Provider value={config}>
        <BrandedComponent {...dynamicConfiguration}/>
    </StaticConfiguration.Provider>;
};

const Nut = nut();
const Geb = geb();

const rootElement = document.getElementById('root');

render(
    <Flex direction={'row'} height={'100%'} width={'100%'} justifyContent={'space-between'}>
        {Nut}
        {Geb}
    </Flex>,

    rootElement
);
