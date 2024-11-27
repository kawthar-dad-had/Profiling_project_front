import { WebTracerProvider } from '@opentelemetry/sdk-trace-web';
import { ConsoleSpanExporter, SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { ZipkinExporter } from '@opentelemetry/exporter-zipkin';
import { FetchInstrumentation } from '@opentelemetry/instrumentation-fetch';
import { DocumentLoadInstrumentation } from '@opentelemetry/instrumentation-document-load';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { Resource } from '@opentelemetry/resources';

const provider = new WebTracerProvider({
  resource: new Resource({
    'service.name': 'frontend-service', // Nom explicite pour le service
  }),
});

// Configure l'exportation vers Zipkin
const zipkinExporter = new ZipkinExporter({
  url: 'http://localhost:9414/api/v2/spans', // URL de Zipkin
});

// Ajout des processeurs pour exporter les traces
provider.addSpanProcessor(new SimpleSpanProcessor(zipkinExporter));
provider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter()));

provider.register();

// Instrumentation des Fetch API et du chargement du document
registerInstrumentations({
  instrumentations: [
    new FetchInstrumentation({
      propagateTraceHeaderCorsUrls: ['http://localhost:8080'], // URL de votre backend
    }),
    new DocumentLoadInstrumentation(),
  ],
});

console.log('OpenTelemetry configured with service name: frontend-service');
