import { expect, test } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import ProfileForm from "./ProfileForm";
import { SpawnerFormProvider } from "./state";

test("image and resource fields initially not tabable", async () => {
  render(
    <SpawnerFormProvider>
      <ProfileForm />
    </SpawnerFormProvider>,
  );

  const imageField = screen.getByLabelText("Image");
  expect(imageField.tabIndex).toEqual(-1);

  const resourceField = screen.getByLabelText("Resource Allocation");
  expect(resourceField.tabIndex).toEqual(-1);
});

test("image and resource fields tabable", async () => {
  const user = userEvent.setup();

  render(
    <SpawnerFormProvider>
      <ProfileForm />
    </SpawnerFormProvider>,
  );

  const radio = screen.getByRole("radio", {
    name: "CPU only No GPU, only CPU",
  });
  await user.click(radio);

  const imageField = screen.getByLabelText("Image");
  expect(imageField.tabIndex).toEqual(0);

  const resourceField = screen.getByLabelText("Resource Allocation");
  expect(resourceField.tabIndex).toEqual(0);
});

test("custom image field is required", async () => {
  const user = userEvent.setup();

  render(
    <SpawnerFormProvider>
      <ProfileForm />
    </SpawnerFormProvider>,
  );

  const radio = screen.getByRole("radio", {
    name: "CPU only No GPU, only CPU",
  });
  await user.click(radio);

  const imageField = screen.getByLabelText("Image");
  await user.click(imageField);
  await user.click(screen.getByText("Specify an existing docker image"));

  const customImageField = screen.getByLabelText("Custom image");
  await user.click(customImageField);
  await user.click(document.body);

  expect(screen.getByText("Enter a value.")).toBeInTheDocument();
});

test("custom image field needs specific format", async () => {
  const user = userEvent.setup();

  render(
    <SpawnerFormProvider>
      <ProfileForm />
    </SpawnerFormProvider>,
  );

  const radio = screen.getByRole("radio", {
    name: "CPU only No GPU, only CPU",
  });
  await user.click(radio);

  const imageField = screen.getByLabelText("Image");
  await user.click(imageField);
  await user.click(screen.getByText("Specify an existing docker image"));

  const customImageField = screen.getByLabelText("Custom image");
  await user.type(customImageField, "abc");
  await user.click(document.body);

  expect(
    screen.getByText(
      "Must be a publicly available docker image, of form <image-name>:<tag>",
    ),
  ).toBeInTheDocument();
});

test("custom image field accepts specific format", async () => {
  const user = userEvent.setup();

  render(
    <SpawnerFormProvider>
      <ProfileForm />
    </SpawnerFormProvider>,
  );

  const radio = screen.getByRole("radio", {
    name: "CPU only No GPU, only CPU",
  });
  await user.click(radio);

  const imageField = screen.getByLabelText("Image");
  await user.click(imageField);
  await user.click(screen.getByText("Specify an existing docker image"));

  const customImageField = screen.getByLabelText("Custom image");
  await user.type(customImageField, "abc:123");
  await user.click(document.body);

  expect(screen.queryByText("Enter a value.")).not.toBeInTheDocument();
  expect(
    screen.queryByText(
      "Must be a publicly available docker image, of form <image-name>:<tag>",
    ),
  ).not.toBeInTheDocument();
});

test("Multiple profiles renders", async () => {
  const user = userEvent.setup();

  render(
    <SpawnerFormProvider>
      <ProfileForm />
    </SpawnerFormProvider>,
  );

  const radio = screen.getByRole("radio", { name: "GPU Nvidia Tesla T4 GPU" });
  await user.click(radio);

  expect(screen.getByLabelText("Image - GPU").tabIndex).toEqual(0);
  expect(screen.getByLabelText("Resource Allocation - GPU").tabIndex).toEqual(
    0,
  );

  const smallImageField = screen.getByLabelText("Image");
  await user.click(smallImageField);
  await user.click(screen.getByText("Specify an existing docker image"));

  const customImageField = screen.getByLabelText("Custom image");
  await user.click(customImageField);
  await user.click(document.body);

  expect(screen.queryByText("Enter a value.")).not.toBeInTheDocument();

  expect(smallImageField.tabIndex).toEqual(-1);
  expect(screen.getByLabelText("Resource Allocation").tabIndex).toEqual(-1);
});

test('select with no options should not render', () => {
  render(
    <SpawnerFormProvider>
      <ProfileForm />
    </SpawnerFormProvider>,
  );
  expect(screen.queryByLabelText("Image - No options")).not.toBeInTheDocument();
});
