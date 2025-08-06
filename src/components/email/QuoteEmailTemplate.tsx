import React from 'react';
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Heading,
  Text,
  Row,
  Column,
  Hr,
  Preview,
  Font,
  Tailwind,
} from '@react-email/components';

interface ServiceItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  serviceType: string;
}

interface CustomerInfo {
  name: string;
  email: string;
  phone?: string;
  message?: string;
}

interface QuoteEmailTemplateProps {
  customerInfo: CustomerInfo;
  cart: ServiceItem[];
  totalItems: number;
  quoteId?: string;
}

export const QuoteEmailTemplate: React.FC<QuoteEmailTemplateProps> = ({
  customerInfo,
  cart,
  totalItems,
  quoteId = `QT-${Date.now()}`,
}) => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Html>
      <Head>
        <Font
          fontFamily="Inter"
          fallbackFontFamily="Arial"
          webFont={{
            url: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
            format: 'woff2',
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Preview>New Quote Request from {customerInfo.name} - {String(totalItems)} services requested</Preview>
      <Tailwind>
        <Body className="bg-gray-50 font-sans">
          <Container className="mx-auto py-8 px-4 max-w-2xl">
            {/* Header */}
            <Section className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-lg p-6">
                <Heading className="text-white text-2xl font-bold m-0 text-center">
                  New Quote Request
                </Heading>
                <Text className="text-blue-100 text-center m-0 mt-2">
                  Quote ID: {quoteId} • {currentDate}
                </Text>
              </div>
            </Section>

            {/* Customer Information */}
            <Section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <Heading className="text-gray-800 text-xl font-semibold mb-4 border-b border-gray-200 pb-2">
                Customer Information
              </Heading>
              <div className="space-y-3">
                <Row>
                  <Column className="w-1/3">
                    <Text className="text-gray-600 font-medium m-0">Full Name:</Text>
                  </Column>
                  <Column>
                    <Text className="text-gray-900 m-0">{customerInfo.name}</Text>
                  </Column>
                </Row>
                <Row>
                  <Column className="w-1/3">
                    <Text className="text-gray-600 font-medium m-0">Email:</Text>
                  </Column>
                  <Column>
                    <Text className="text-gray-900 m-0">{customerInfo.email}</Text>
                  </Column>
                </Row>
                <Row>
                  <Column className="w-1/3">
                    <Text className="text-gray-600 font-medium m-0">Phone:</Text>
                  </Column>
                  <Column>
                    <Text className="text-gray-900 m-0">
                      {customerInfo.phone || 'Not provided'}
                    </Text>
                  </Column>
                </Row>
                {customerInfo.message && (
                  <>
                    <Hr className="border-gray-200 my-4" />
                    <div>
                      <Text className="text-gray-600 font-medium mb-2">Additional Requirements:</Text>
                      <Text className="text-gray-900 bg-gray-50 p-3 rounded border border-gray-200 whitespace-pre-wrap">
                        {customerInfo.message}
                      </Text>
                    </div>
                  </>
                )}
              </div>
            </Section>

            {/* Services Summary */}
            <Section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <Heading className="text-gray-800 text-xl font-semibold mb-4 border-b border-gray-200 pb-2">
                Requested Services
              </Heading>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <Row>
                  <Column className="w-1/2">
                    <Text className="text-blue-800 font-semibold m-0">
                      Total Service Types: {cart.length}
                    </Text>
                  </Column>
                  <Column className="w-1/2 text-right">
                    <Text className="text-blue-800 font-semibold m-0">
                      Total Quantity: {totalItems}
                    </Text>
                  </Column>
                </Row>
              </div>

              {/* Service Items */}
              <div className="space-y-4">
                {cart.map((item, index) => (
                  <div key={item.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <Row className="mb-2">
                      <Column className="w-3/4">
                        <Text className="text-gray-900 font-semibold text-lg m-0">
                          {item.name}
                        </Text>
                        <Text className="text-blue-600 font-medium text-sm m-0 mt-1">
                          {item.serviceType}
                        </Text>
                      </Column>
                      <Column className="w-1/4 text-right">
                        <div className="bg-blue-600 text-white px-3 py-1 rounded-full inline-block">
                          <Text className="text-white font-semibold text-sm m-0">
                            Qty: {item.quantity}
                          </Text>
                        </div>
                      </Column>
                    </Row>
                    <Text className="text-gray-700 text-sm m-0 mt-2">
                      {item.description}
                    </Text>
                  </div>
                ))}
              </div>
            </Section>

            {/* Action Required */}
            <Section className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg p-6 mb-6">
              <Heading className="text-orange-800 text-lg font-semibold mb-3">
                ⚡ Action Required
              </Heading>
              <Text className="text-orange-700 m-0 mb-2">
                Please respond to this quote request within <strong>24-48 hours</strong>.
              </Text>
              <Text className="text-orange-700 m-0">
                Customer is waiting for pricing and timeline information.
              </Text>
            </Section>

            {/* Footer */}
            <Section className="text-center">
              <Hr className="border-gray-300 my-6" />
              <Text className="text-gray-500 text-sm m-0">
                This quote request was generated automatically from your website.
              </Text>
              <Text className="text-gray-500 text-sm m-0 mt-2">
                Quote ID: {quoteId} • Generated on {currentDate}
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default QuoteEmailTemplate;