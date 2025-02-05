import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { isNotEmpty } from '@gauzy/common';
import { IntegrationEnum } from '@gauzy/contracts';
import { RequestConfigProvider } from '@gauzy/integration-ai';
import { arrayToObject } from './../../core/utils';
import { IntegrationTenantService } from './../../integration-tenant/integration-tenant.service';

@Injectable()
export class IntegrationAIMiddleware implements NestMiddleware {
	private logging = true;

	constructor(
		private readonly _integrationTenantService: IntegrationTenantService,
		private readonly _requestConfigProvider: RequestConfigProvider
	) { }

	async use(request: Request, _response: Response, next: NextFunction) {
		try {
			// Extract tenant and organization IDs from request headers and body
			const tenantId = request.header('tenant-id') || request.body?.tenantId;
			const organizationId = request.header('organization-id') || request.body?.organizationId;

			if (this.logging) {
				// Log tenant and organization IDs
				console.log('Auth Tenant-ID Header: %s', tenantId);
				console.log('Auth Organization-ID Header: %s', organizationId);
			}

			// Initialize custom headers
			request.headers['X-APP-ID'] = null;
			request.headers['X-API-KEY'] = null;
			request.headers['X-OPENAI-SECRET-KEY'] = null;
			request.headers['X-OPENAI-ORGANIZATION-ID'] = null;

			// Set default configuration in the requestConfigProvider if no integration settings found
			this._requestConfigProvider.resetConfig();

			// Check if tenant and organization IDs are not empty
			if (isNotEmpty(tenantId) && isNotEmpty(organizationId)) {
				// Fetch integration settings from the service
				const integrationTenant = await this._integrationTenantService.getIntegrationTenantSettings({
					tenantId,
					organizationId,
					name: IntegrationEnum.GAUZY_AI
				});

				if (integrationTenant && integrationTenant.settings && integrationTenant.settings.length > 0) {
					const settings = arrayToObject(integrationTenant.settings, 'settingsName', 'settingsValue');

					// Log API Key and API Secret if logging is enabled
					if (this.logging) {
						console.log('AI Integration API Key:', settings.apiKey);
						console.log('AI Integration API Secret:', settings.apiSecret);
					}

					const { apiKey, apiSecret, openAiSecretKey, openAiOrganizationId } = settings;

					if (apiKey && apiSecret) {
						// Update custom headers and request configuration with API key and secret
						request.headers['X-APP-ID'] = apiKey;
						request.headers['X-API-KEY'] = apiSecret;

						// Add OpenAI headers if available
						if (isNotEmpty(openAiSecretKey)) {
							request.headers['X-OPENAI-SECRET-KEY'] = openAiSecretKey;
						}

						if (isNotEmpty(openAiOrganizationId)) {
							request.headers['X-OPENAI-ORGANIZATION-ID'] = openAiOrganizationId;
						}

						// Log configuration settings if logging is enabled
						if (this.logging) {
							console.log('AI Integration Config Settings:', { apiKey, apiSecret, openAiSecretKey, openAiOrganizationId });
						}

						// Set configuration in the requestConfigProvider
						this._requestConfigProvider.setConfig({
							apiKey,
							apiSecret,
							...(isNotEmpty(openAiSecretKey) && { openAiSecretKey }),
							...(isNotEmpty(openAiOrganizationId) && { openAiOrganizationId }),
						});
					}
				}
			}
		} catch (error) {
			console.log('Error while getting AI integration settings: %s', error?.message);
			console.log(request.path, request.url);
		}

		// Continue to the next middleware or route handler
		next();
	}
}
