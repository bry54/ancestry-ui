import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export interface FaqItem {
  title: string;
  text: string;
}

export type FaqItems = Array<FaqItem>;

export function Faq() {
  const items: FaqItems = [
    {
      title: 'How do I start building my family tree?',
      text: 'To start building your family tree, begin by adding yourself and your immediate family members. Then, you can invite other family members to collaborate and add their branches. Our system will also provide hints and suggestions based on historical records.',
    },
    {
      title: 'Is my family data private and secure?',
      text: 'Yes, protecting your family’s data is our top priority. We use industry-standard encryption and security measures to ensure your information is safe. You have full control over who can see your family tree and the information you share.',
    },
    {
      title: 'What subscription plans are available?',
      text: 'We offer various subscription plans to fit your needs, from a free basic plan to premium plans with access to more historical records, advanced DNA features, and more. You can find detailed information on our pricing page.',
    },
    {
      title: 'Can I connect with other users and relatives?',
      text: 'Yes, our platform allows you to connect with other users who may be related to you based on your family tree data and DNA matches. You can choose to share information and collaborate on your family history.',
    },
    {
      title: 'How accurate are the historical records?',
      text: 'We partner with various archives and historical societies to provide you with access to a vast collection of records. While we strive for accuracy, we recommend cross-referencing information and using the records as clues in your research.',
    },
    {
      title: 'What kind of support do you offer?',
      text: 'We offer comprehensive support through our Help Center, email, and phone. Our support team is available to assist you with any questions or issues you may have while using our platform.',
    },
  ];

  const generateItems = () => {
    return (
      <Accordion type="single" collapsible>
        {items.map((item, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger>{item.title}</AccordionTrigger>
            <AccordionContent>{item.text}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>FAQ</CardTitle>
      </CardHeader>
      <CardContent className="py-3">{generateItems()}</CardContent>
    </Card>
  );
}
