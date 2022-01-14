import { ChakraProvider, Flex, Link, VStack } from '@chakra-ui/react';
import * as React from 'react';
import { render } from 'react-dom';
import { bottomBarExtension, createBrandedExperience, DynamicConfiguration, mainViewContentExtension, StaticConfiguration } from './core/core';
import { DefaultExtensionRegistry } from './extension-api/extension-registry';
import './index.css';

const Contact = () => {
    return <Link>Send us a mail</Link>;
};
const TermsOfUse = () => {
    return <Link>Terms of Use</Link>;
};
const PrivacyPolicy = () => {
    return <Link>Privacy Policy</Link>;
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
    <ChakraProvider>
        <VStack>
            <div>topbar</div>
            <Flex direction={'row'} height={'100%'} width={'100%'} justifyContent={'space-between'}>
                {Nut}
                {Geb}
            </Flex>
        </VStack>
    </ChakraProvider>,
    rootElement
);
